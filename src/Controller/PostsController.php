<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\PostCategory;
use App\Entity\PostLike;
use App\Entity\User;
use App\Form\PostType;
use App\Repository\CategoryRepository;
use App\Repository\CommentRepository;
use App\Repository\PostCategoryRepository;
use App\Repository\PostLikeRepository;
use App\Repository\PostRepository;
use DateTime;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use \Symfony\Component\HttpFoundation\JsonResponse as JsonResponse;

/**
 * @Route("/api/posts", name="api_posts")
 */
class PostsController extends AbstractController
{

    private $entityManager;
    private $postRepository;
    private $categoryRepository;
    private $commentRepository;
    private $likeRepository;
    private $postCategoriesRepository;

    public function __construct(EntityManagerInterface $entityManager, PostRepository $postRepository, CategoryRepository $categoryRepository, PostCategoryRepository $postCategoriesRepository, CommentRepository $commentRepository, PostLikeRepository $likeRepository)
    {
        $this->entityManager = $entityManager;
        $this->postRepository = $postRepository;
        $this->categoryRepository = $categoryRepository;
        $this->postCategoriesRepository = $postCategoriesRepository;
        $this->likeRepository = $likeRepository;
        $this->commentRepository = $commentRepository;
    }

    /**
     * @Route("/read", name="api_posts_read", methods={"GET"})
     */
    public function read(): JsonResponse
    {
        $posts = $this->postRepository->findAll();

        $arrayOfPosts = [];
        foreach ($posts as $post) {
            $arrayOfPosts[] = $post->toArray();
        }
        return $this->json($arrayOfPosts);
    }

    /**
     * @Route("/readOne/{slug}", name="api_post_read", methods={"GET"})
     * @param $slug
     * @return JsonResponse
     */
    public function readOne($slug): JsonResponse
    {
        $post = $this->postRepository->findOneBy(['slug' => $slug]);

        return $this->json($post);
    }

    /**
     * @Route("/readCategory/{slug}", name="api_post_category_read", methods={"GET"})
     * @param $slug
     * @return JsonResponse
     */
    public function readCategory($slug): JsonResponse
    {
        $category = $this->categoryRepository->findOneBy(['slug' => $slug]);
        $postCategories = $this->postCategoriesRepository->findBy(['category_id' => $category->getId()]);
        $posts = [];
        foreach($postCategories as $postCategory){
            $post = $this->postRepository->findOneBy(['id' => $postCategory->getPostId()]);
            $posts[] = $post->toArray();
        }

        return $this->json($posts);
    }

    /**
     * @Route("/search/{data}", name="api_posts_search", methods={"GET"})
     * @param $data
     * @return JsonResponse
     */
    public function search($data): JsonResponse
    {
        $query = $this->entityManager->createQueryBuilder()
            ->select('p')
            ->from('Post:post', 'p')
            ->where('p.title LIKE :title')
            ->setParameter('title', '%'.$data.'%')
            ->orWhere('p.content LIKE :content')
            ->setParameter('content', '%'.$data.'%')
            ->orderBy('p.name', 'ASC')
            ->getQuery();

        $query = $this->entityManager->createQuery(
            'SELECT p
            FROM App\Entity\Post p
            WHERE p.title LIKE :title
            OR p.content LIKE :content
            ORDER BY p.created_at DESC'
        )->setParameter('title', '%'.$data.'%')->setParameter('content', '%'.$data.'%');

        $array = $query->getArrayResult();

        return $this->json($array);
    }

    /**
     * @Route("/create", name="api_post_create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent());

        $form = $this->createForm(PostType::class);
        $form->submit((array)$content);

        if (!$form->isValid()) {
            $errors = [];
            foreach ($form->getErrors(true, true) as $error) {
                $propertyName = $error->getOrigin()->getName();
                $errors[$propertyName] = $error->getMessage();
            }
            return $this->json([
                'message' => ['text' => join("\n", $errors), 'level' => 'error'],
            ]);

        }

        $post = new Post();

        if(!$content->title){
            $title = substr(strip_tags($content->content),0,80);
            $title = $title . '...';
        } else {
            $title = $content->title;
        }
        $post->setTitle($title);
        /** @var User $user */
        $user = $this->getUser();
        if(isset($user)){
            $post->setUser($user->getId());
        } else {
            $post->setUser(1);
        }
        $post->setContent($content->content);
        $excerpt = substr(strip_tags($content->content),0,250);
        $excerpt = $excerpt . '...';
        $post->setExcerpt($excerpt);
        $slug = str_replace(' ', '-', $content->title);
        $slug = preg_replace('/[^A-Za-z0-9\-]/', '', $slug);
        $post->setSlug($slug);
        $post->setViews(0);
        $post->setComments(0);
        $post->setLikes(0);
        $post->setCreatedAt(new DateTime());

        try {
            $this->entityManager->persist($post);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $exception) {
            return $this->json([
                'message' => ['text' => 'Post has to be unique!', 'level' => 'error']
            ]);

        }

        if($content->categories){
            foreach($content->categories as $id => $state){

                if($state === true){
                    $postCategory = new PostCategory();
                    $postCategory->setPostId($post->getId());
                    $postCategory->setCategoryId($id);
                    $postCategory->setCreatedAt(new DateTime());

                    try {
                        $this->entityManager->persist($postCategory);
                        $this->entityManager->flush();
                    } catch (UniqueConstraintViolationException $exception) {
                        return $this->json([
                            'message' => ['text' => 'Category has to be unique!', 'level' => 'error']
                        ]);
                    }

                    $category = $this->categoryRepository->findOneBy(['id' => $id]);
                    $category->setCount(
                        $category->getCount() + 1
                    );
                    $this->entityManager->flush();
                }
            }
        }

        return $this->json([
            'post'    => $post->toArray(),
            'message' => ['text' => 'Post has been created!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/update/{id}", name="api_post_update", methods={"PUT"})
     * @param Request $request
     * @param Post $post
     * @return JsonResponse
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $content = json_decode($request->getContent());

        if ($post->getTitle() === $content->title && $post->getContent() === $content->content) {
            return $this->json([
                'message' => ['text' => 'There was no change to the post. Neither the title nor the content was changed.', 'level' => 'error']
            ]);
        }
        if(isset($content->title)){
            $post->setTitle($content->title);
            $slug = str_replace(' ', '-', $content->title);
            $post->setSlug($slug);
        }
        if(isset($content->content)) {
            $post->setContent($content->content);
            $excerpt = substr(strip_tags($content->content),0,250);
            $excerpt = $excerpt . '...';
            $post->setExcerpt($excerpt);
        }
        if(isset($content->categories)) {
            $post->setCategories($content->categories);
        }

        try {
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to update a post.', 'level' => 'error']
            ]);
        }

        return $this->json([
            'post'    => $post->toArray(),
            'message' => ['text' => 'Post successfully updated!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/like/{id}", name="api_post_like", methods={"PUT"})
     * @param $id
     * @return JsonResponse
     */
    public function like($id): JsonResponse
    {
        $post = $this->postRepository->find($id);
        $user = $this->getUser();
        if(!isset($user)){
            return $this->json([
                'message' => ['text' => 'Please log-in to like posts!', 'level' => 'error']
            ]);
        }
        $like = $this->likeRepository->findOneBy(['user_id' => $user->getId(), 'post_id' => $post->getId()]);

        if(!isset($like)){
            $like = new PostLike();
            $like->setPostId($post->getId());
            $like->setUserId($user->getId());
            $like->setCreatedAt(new DateTime());
            $this->entityManager->persist($like);
            $post->setLikes(
                $post->getLikes() + 1
            );
        } else {
            $this->entityManager->remove($like);
            $post->setLikes(
                $post->getLikes() - 1
            );
        }

        try {
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to update a post.', 'level' => 'error']
            ]);
        }

        return $this->json([
            'post' => $post->toArray(),
            'message' => ['text' => 'Post liked!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/delete/{id}", name="api_post_delete", methods={"DELETE"})
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse
    {

        $post = $this->postRepository->find($id);
        $comments = $this->commentRepository->findBy(['post_id' => $post->getId()]);
        foreach ($comments as $comment){
            $this->entityManager->remove($comment);
        }

        try {
            $this->entityManager->remove($post);
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to delete a post.', 'level' => 'error']
            ]);

        }

        return $this->json([
            'message' => ['text' => 'Post has successfully been deleted!', 'level' => 'success']
        ]);

    }

}
