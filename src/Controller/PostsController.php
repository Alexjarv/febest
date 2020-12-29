<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\User;
use App\Form\PostType;
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

    public function __construct(EntityManagerInterface $entityManager, PostRepository $postRepository)
    {
        $this->entityManager = $entityManager;
        $this->postRepository = $postRepository;
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
     * @Route("/search", name="api_posts_search", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent());

        $result = $this->postRepository->createQueryBuilder('a')
            ->where('a.title LIKE :title')
            ->setParameter('title', '%'.$content->content.'%')
            ->getQuery();

        return $this->json($result);
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

        $form = $this->createForm(PostType::class);
        $nonObject = (array)$content;
        unset($nonObject['id']);
        $form->submit($nonObject);


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
     * @Route("/delete/{id}", name="api_post_delete", methods={"DELETE"})
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse
    {

        $post = $this->postRepository->find($id);

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
