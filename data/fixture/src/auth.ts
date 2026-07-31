// @ts-nocheck
export async function login(email: string, password: string) {
  const user = await db.users.findOne({ email, password });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  return user;
}
