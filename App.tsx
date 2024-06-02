import { StyleSheet } from 'react-native';
import { firebaseConfig } from "./config/firebase";
import { FirebaseAppProvider, FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';
import { Main } from './src/components/main';

export default function App() {
	return (
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<Main />
		</FirebaseAppProvider>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
