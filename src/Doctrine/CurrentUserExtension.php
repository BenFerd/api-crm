<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {

    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    private function addwhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        // On récupère le User connecté
        $user = $this->security->getUser();
        // Si on demande des factures ou des clients alors, agit sur la requête 
        // pour qu'elle tienne compte de l'utilisateur connecté et qu'il ne voit que ses factures et clients.
        // Si admin il peut tout voir.
        if(
            ($resourceClass === Customer::class || $resourceClass === Invoice::class) 
            &&
            !$this->auth->isGranted('ROLE_ADMIN') 
            // && $user instanceof User
            )
        {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if($resourceClass === Customer::class){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } elseif($resourceClass === Invoice::class){
                $queryBuilder->join("$rootAlias.customer", "c")
                            ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
            
        }
    }


    public function applyToCollection(QueryBuilder $queryBuilder,
     QueryNameGeneratorInterface $queryNameGenerator,
      string $resourceClass, ?string $operationName = null)
    {
        $this->addwhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder,
     QueryNameGeneratorInterface $queryNameGenerator, 
     string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addwhere($queryBuilder, $resourceClass);
    }
}