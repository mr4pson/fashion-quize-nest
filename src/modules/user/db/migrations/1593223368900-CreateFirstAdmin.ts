import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { User } from '../../model/user.entity';
import * as bcrypt from 'bcrypt';

export class CreateFirstAdmin1593223368900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // const userRepository: Repository<User> = queryRunner.connection.getRepository(User);

        // if (await userRepository.findOne({where: {login: 'admin'}})) {
        //     return;
        // }

        // const user: User = userRepository.create({
        //     login: 'admin',
        //     passwordHash: await bcrypt.hash('secret', 10),
        //     name: 'GromMax'
        // });

        // await userRepository.insert(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // const userRepository: Repository<User> = queryRunner.connection.getRepository(User);
        // const user: User = await userRepository.findOne({where: {login: 'admin'}});
        // if (!user) {
        //     return;
        // }

        // await userRepository.remove(user);
    }

}
