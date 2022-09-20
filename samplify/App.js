import { firebaseConfig } from './firebase.js';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

export const app = initializeApp(firebaseConfig);

export default function App() {
    return;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusbar: {
    height: 20,
  }
});