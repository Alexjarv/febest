<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\User;
use App\Form\CommentType;
use App\Repository\CommentRepository;
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
 * @Route("/api/comments", name="api_posts")
 */
class CommentsController extends AbstractController
{

    private $entityManager;
    private $commentRepository;
    private $postRepository;

    public function __construct(EntityManagerInterface $entityManager, PostRepository $postRepository, CommentRepository $commentRepository)
    {
        $this->entityManager = $entityManager;
        $this->postRepository = $postRepository;
        $this->commentRepository = $commentRepository;
    }

    /**
     * @Route("/read/{id}", name="api_comment_read", methods={"GET"})
     * @param $id
     * @return JsonResponse
     */
    public function read($id): JsonResponse
    {
        $comments = $this->commentRepository->findBy(['post_id' => $id]);

        $arrayOfComments = [];
        foreach ($comments as $comment) {
            $arrayOfComments[] = $comment->toArray();
        }
        return $this->json($arrayOfComments);
    }

    /**
     * @Route("/create", name="api_comment_create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent());

        $form = $this->createForm(CommentType::class);
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

        $comment = new Comment();
        /** @var User $user */
        $user = $this->getUser();
        if(isset($user)){
            $comment->setUserId($user->getId());
        } else {
            $comment->setUserId(1);
        }
        $comment->setPostId($content->post_id);
        $comment->setContent($content->content);
        $comment->setLikes(0);
        $comment->setCreatedAt(new DateTime());

        $post = $this->postRepository->findOneBy(['id' => $content->post_id]);

        $post->setComments(
            $post->getComments() + 1
        );

        try {
            $this->entityManager->persist($comment);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $exception) {
            return $this->json([
                'message' => ['text' => 'Comment has to be unique!', 'level' => 'error']
            ]);

        }
        return $this->json([
            'comment'    => $comment->toArray(),
            'post' => $post->toArray(),
            'message' => ['text' => 'Comment has been created!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/update/{id}", name="api_comment_update", methods={"PUT"})
     * @param Request $request
     * @param Comment $comment
     * @return JsonResponse
     */
    public function update(Request $request, Comment $comment): JsonResponse
    {
        $content = json_decode($request->getContent());

        $form = $this->createForm(CommentType::class);
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

        if ($comment->getContent() === $content->content) {
            return $this->json([
                'message' => ['text' => 'There was no change to the comment. The content was not changed.', 'level' => 'error']
            ]);
        }

        $comment->setContent($content->content);

        try {
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to update a comment.', 'level' => 'error']
            ]);
        }

        return $this->json([
            'post'    => $comment->toArray(),
            'message' => ['text' => 'Comment successfully updated!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/hide/{id}", name="api_comment_hide", methods={"PUT"})
     * @param integer $id
     * @return JsonResponse
     */
    public function hide(int $id): JsonResponse
    {

        $comment = $this->commentRepository->findOneBy(['id' => $id]);

        if($comment->getIsHidden() == 1){
            $comment->setIsHidden(0);
        } else {
            $comment->setIsHidden(1);
        }

        try {
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to update the comment.', 'level' => 'error']
            ]);
        }

        $comments = $this->commentRepository->findBy(['post_id' => $comment->getPostId()]);

        $arrayOfComments = [];
        foreach ($comments as $comment) {
            $arrayOfComments[] = $comment->toArray();
        }

        return $this->json([
            'comments'    => $arrayOfComments,
            'message' => ['text' => 'Comment is successfully updated!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/delete/{id}", name="api_comment_delete", methods={"DELETE"})
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse
    {

        $comment = $this->commentRepository->find($id);

        $post = $this->postRepository->findOneBy(['id' => $comment->getPostId()]);
        $post->setComments(
            $post->getComments() - 1
        );

        try {
            $this->entityManager->remove($comment);
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to delete a comment.', 'level' => 'error']
            ]);

        }

        return $this->json([
            'post' => $post->toArray(),
            'message' => ['text' => 'Comment has successfully been deleted!', 'level' => 'success']
        ]);

    }

}
