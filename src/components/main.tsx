import { StyleSheet, Text, View } from 'react-native';
import {
	NavigationContainer,
	useNavigationContainerRef
  } from '@react-navigation/native'
import { doc, getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';

export function Main() {
	const firestoreInstance = getFirestore(useFirebaseApp());
	return (
		<FirestoreProvider sdk={firestoreInstance}>
			<View>
				<Text>ALles gut</Text>
			</View>
		</FirestoreProvider>
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
