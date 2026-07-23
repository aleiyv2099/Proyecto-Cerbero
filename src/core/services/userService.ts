import { User } from "../entity/User";
import { UserRepositoryPort } from "../ports/UserRepositoryPort";
import { Ecrypt } from "../../adapters/helpers/encrypt";

export class UserService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  // Quita acentos y deja solo letras a-z
  private slug(text: string): string {
    // NFD separa la letra de su acento; [^a-zA-Z] descarta acentos y símbolos
    return (text || "")
      .normalize("NFD")
      .replace(/[^a-zA-Z]/g, "")
      .toLowerCase();
  }

  // Requisito 1.1: Juan Alberto Piguave Loor -> "jpiguavel"
  // inicial(primer nombre) + primer apellido + inicial(segundo apellido).
  // Duplicados: se agrega un número incremental (jpiguavel1, jpiguavel2...).
  async generateCredentials(nombres: string, apellidos: string): Promise<{ userName: string; mail: string }> {
    const nombreParts = this.slug(nombres.split(" ")[0]);
    const apellidoWords = apellidos.trim().split(/\s+/);
    const primerApellido = this.slug(apellidoWords[0]);
    const segundoApellidoInicial = apellidoWords[1] ? this.slug(apellidoWords[1]).charAt(0) : "";

    const base = `${nombreParts.charAt(0)}${primerApellido}${segundoApellidoInicial}`;
    if (base.length < 2) {
      throw new Error("Nombres y apellidos insuficientes para generar el usuario");
    }

    let suffix = 0;
    // busca el primer sufijo libre en username y correo
    while (true) {
      const candidate = suffix === 0 ? base : `${base}${suffix}`;
      const takenUser = await this.userRepository.findByUserName(candidate);
      const takenMail = await this.userRepository.findByEmail(`${candidate}@mail.com`);
      if (!takenUser && !takenMail) {
        return { userName: candidate, mail: `${candidate}@mail.com` };
      }
      suffix++;
    }
  }

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

    // Requisito 3: valida y encripta la contraseña antes de guardar
    user.password = await Ecrypt.passwordEncrypt(user.password);
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