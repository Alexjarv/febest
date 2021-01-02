<?php

namespace App\Controller;

use App\Entity\Category;
use App\Form\CategoryType;
use App\Repository\CategoryRepository;
use App\Repository\PostCategoryRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use \Symfony\Component\HttpFoundation\JsonResponse as JsonResponse;

/**
 * @Route("/api/categories", name="api_categories")
 */
class CategoriesController extends AbstractController
{

    private $entityManager;
    private $categoryRepository;
    private $postCategoryRepository;

    public function __construct(EntityManagerInterface $entityManager, CategoryRepository $categoryRepository, PostCategoryRepository $postCategoryRepository)
    {
        $this->entityManager = $entityManager;
        $this->categoryRepository = $categoryRepository;
        $this->postCategoryRepository = $postCategoryRepository;
    }

    /**
     * @Route("/read", name="api_categories_read", methods={"GET"})
     */
    public function read(): JsonResponse
    {
        $categories = $this->categoryRepository->findAll();

        $arrayOfCategories = [];
        foreach ($categories as $category) {
            $arrayOfCategories[] = $category->toArray();
        }
        return $this->json($arrayOfCategories);
    }

    /**
     * @Route("/readByPost/{id}", name="api_post_categories_read", methods={"GET"})
     * @param $id
     * @return JsonResponse
     */
    public function readByPost($id): JsonResponse
    {
        $postCategories = $this->postCategoryRepository->findBy(["post_id" => $id]);

        $arrayOfCategories = [];
        foreach ($postCategories as $postCategory) {
            $category = $this->categoryRepository->findOneBy(["id" => $postCategory->getCategoryId()]);
            $arrayOfCategories[] = $category->getTitle();
        }
        return $this->json($arrayOfCategories);
    }

    /**
     * @Route("/create", name="api_category_create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent());

        $form = $this->createForm(CategoryType::class);
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

        // look for a single Product by name
        $category = $this->categoryRepository->findOneBy(['title' => $content->title]);

        if($category){
            $category->setCount($category->getCount() + 1);
        } else {
            $category = new Category();
            $category->setTitle($content->title);
            $category->setCount(0);
            $category->setCreatedAt(new \DateTime());
        }
            try {
                $this->entityManager->persist($category);
                $this->entityManager->flush();
            } catch (UniqueConstraintViolationException $exception) {
                return $this->json([
                    'message' => ['text' => 'Category has to be unique!', 'level' => 'error']
                ]);

            }

        return $this->json([
            'todo'    => $category->toArray(),
            'message' => ['text' => 'Category has been created!', 'level' => 'success']
        ]);
    }

    /**
     * @Route("/delete/{id}", name="api_post_delete", methods={"DELETE"})
     * @param Category $category
     * @return JsonResponse
     */
    public function delete(Category $category): JsonResponse
    {
        try {
            $this->entityManager->remove($category);
            $this->entityManager->flush();
        } catch (Exception $exception) {
            return $this->json([
                'message' => ['text' => 'Could not reach database when attempting to delete a category.', 'level' => 'error']
            ]);

        }

        return $this->json([
            'message' => ['text' => 'Category has successfully been deleted!', 'level' => 'success']
        ]);

    }

}
