import { User } from "../../core/entity/User";
import { UserRepositoryPort } from "../../core/ports/UserRepositoryPort";
import { AppDataSource } from "../database/data-source";

export class TypeOrmUserRepositoryPort implements UserRepositoryPort {
  private userRepository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ["persona", "roles", "sessions"] });
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { mail: email },
      relations: ["persona", "roles", "sessions"],
    });
    return user;
  }

  async findId(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { idUsuario: parseInt(id) },
      relations: ["persona", "roles", "sessions"],
    });
    return user;
  }

  async updateUser(id: string, partialUser: Partial<User>): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { idUsuario: parseInt(id) } });
    if (!userToUpdate) {
      throw new Error("User not found");
    }

    Object.assign(userToUpdate, partialUser);

    return await this.userRepository.save(userToUpdate);
  }

  async deleteUser(id: string): Promise<boolean> {
    const userToDelete = await this.userRepository.findOne({ where: { idUsuario: parseInt(id) } });
    if (!userToDelete) {
      throw new Error("User not found");
    }

    await this.userRepository.remove(userToDelete);
    return true;
  }

  async createUser(user: User): Promise<User> {
    const newUser = this.userRepository.create(user); // Prepare the entity
    return await this.userRepository.save(newUser); // Save it to the database
  }
  async findByIdentifier(identifier: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [
        { mail: identifier }, // Buscar por correo
        { userName: identifier }, // Buscar por nombre de usuario
      ],
      relations: ["persona", "roles", "sessions"], // Incluir relaciones necesarias
    });
    return user;
  }
  async findByUserName(userName: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { userName },
      relations: ["persona", "roles", "sessions"],
    });
    return user;
  }
  async findByPersonaId(personaId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { persona: { idPersona: personaId } } });
  }
}