import { User } from "../entity/User";
import { UserRepositoryPort } from "../ports/UserRepositoryPort";
import * as bcrypt from "bcrypt";
import { Ecrypt } from "../../adapters/helpers/encrypt";

export class UserService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  //user
  async getUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
  async createUser(user: User): Promise<User> {
    // Validar que el nombre de usuario no esté duplicado
    const existingUser = await this.userRepository.findByUserName(user.userName);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // user.password = await Ecrypt.passwordEncrypt(user.password);
    return await this.userRepository.createUser(user);
  }
  async updateUser(id: string, user: User): Promise<User> {
    return await this.userRepository.updateUser(id, user);
  }
  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.deleteUser(id);
  }
  async getUser(id: string): Promise<User | null> {
    return await this.userRepository.findId(id);
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
  async findByPersonaId(personaId: number): Promise<User | null> {
    return await this.userRepository.findByPersonaId(personaId);
  }
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // Comparar directamente las contraseñas en texto plano
    return await Ecrypt.comparePass(plainPassword, hashedPassword);
  }
  async getUserByIdentifier(identifier: string): Promise<User | null> {
    return await this.userRepository.findByIdentifier(identifier); // Buscar por correo o nombre de usuario
  }
  
}