<?php

namespace App\Form;

use App\Entity\PostLike;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class LikeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('post_id')
            ->add('user_id')
            ->add('created_at')
            ->add('updated_at')
            ->add('deleted_at')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PostLike::class,
        ]);
    }
}
