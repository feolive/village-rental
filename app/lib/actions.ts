'use server';
 
import { signIn,signOut } from '@/auth';
import { AuthError } from 'next-auth';
 

 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw error;
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  try{
    await signOut();
  }catch(error){
    console.log(error);
    throw error;
  }
}