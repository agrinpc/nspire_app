import { StyleSheet, Text, View } from 'react-native';
import {
	NavigationContainer,
	useNavigationContainerRef
  } from '@react-navigation/native'
import {
	ActivityIndicator,
	Modal,
	Provider as PaperProvider,
	useTheme
} from 'react-native-paper'
import { doc, getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';
import { ThemeProvider } from 'styled-components';
import { navTheme, paperTheme, styledTheme } from '../utils/themes';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { trackEvent } from '../analytics';

export function Main() {
	const navigationRef = useNavigationContainerRef()
	const routeNameRef = useRef<string>()
	const firestoreInstance = getFirestore(useFirebaseApp());
	return (
		<FirestoreProvider sdk={firestoreInstance}>
			<ThemeProvider theme={styledTheme}>
				<PaperProvider theme={paperTheme}>
					<BottomSheetModalProvider>
						<NavigationContainer
							ref={navigationRef}
							theme={navTheme}
							onStateChange={() => {
								const previousRouteName = routeNameRef.current
								const currentRouteName =
								  navigationRef?.getCurrentRoute()?.name
		  
								if (previousRouteName !== currentRouteName) {
								  trackEvent('screen_view', { screen: currentRouteName })
								}
								routeNameRef.current = currentRouteName
							  }}>
							<Navigation />
						</NavigationContainer>
					</BottomSheetModalProvider>
				</PaperProvider>
			</ThemeProvider>
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
