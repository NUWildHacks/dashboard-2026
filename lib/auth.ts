import { firebaseApp } from '@/config/firebase';
import { FirebaseError } from "firebase/app";
import { getAuth, getRedirectResult, GithubAuthProvider, signInWithRedirect } from 'firebase/auth';

export const loginWithGithub = async () => {
  try {
    const auth = getAuth(firebaseApp);

    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope("user:email");

    await signInWithRedirect(auth, githubProvider) 

    const result = await getRedirectResult(auth);

    if (result) {
      const uid = result.user.uid;
      console.log(uid);
    }
  } catch (e) {
    const errorMessage = e instanceof FirebaseError ? e.message : "An unknown error occurred";

    console.error(errorMessage);
  }
}
