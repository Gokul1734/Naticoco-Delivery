import { StyleSheet } from 'react-native';

//Naticoco Primary color : #F8931F
//Naticoco Secondary color : #89C73A


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
 },
 titleText: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#333',
 },
 button: {
   backgroundColor: '#F8931F',
   padding: 10,
   borderRadius: 5,
 },
 button2: {
  backgroundColor: 'red',
  padding: 10,
  borderRadius: 5,
},
 buttonText: {
   color: 'white',
   fontSize: 16,
 },
});

export default styles;