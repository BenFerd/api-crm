<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encodeur de mots de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder; // hash
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for($u = 0; $u < 10; $u++){ // boucle pour créer 10 users.
            $user = new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, "password");// hash le mdp pour qu'il ne soit pas visible en db.

            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($hash);

            $manager->persist($user);

            for($c = 0; $c < mt_rand(5, 20); $c++) { // boucle pour créer un nbr aléatoire de clients pour ce user.
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                         ->setLastName($faker->lastName)
                         ->setCompany($faker->company)
                         ->setEmail($faker->email)
                         ->setUser($user);
                
                $manager->persist($customer);
    
                for($i = 0; $i < mt_rand(3,10); $i++) { // boucle pour créer un nbr aléatoire de factures pour chaque client
                    $invoice = new Invoice();           // de ce user avec le numero de facture qui commence à 1.
                    $invoice->setAmout($faker->randomFloat(2, 100, 10000))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                            ->setCustomer($customer)
                            ->setChrono($chrono);
                    
                    $chrono++;
                    
                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
