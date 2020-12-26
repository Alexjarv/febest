<?php

namespace App\Form;

use App\Entity\Post;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('user_id')
            ->add('title')
            ->add('content')
            ->add('slug')
            ->add('comments')
            ->add('views')
            ->add('created_at', 'datetime', array('widget' => 'single_text',
                'date_format' => 'yyyy-MM-dd  HH:mm'))
            ->add('updated_at')
            ->add('deleted_at')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Post::class,
        ]);
    }
}
