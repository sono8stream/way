import firebase from 'firebase';
import "firebase/storage";

jest.mock('../../firebase', () => {
  const firebase = require('firebase');
  const testFirebaseConfig = {
    apiKey: "AIzaSyCBXWCzAv-oAT-HlUgNdHHIgh7fl2O5uDE",
    authDomain: "whoareyou-dev.firebaseapp.com",
    databaseURL: "https://whoareyou-dev.firebaseio.com",
    projectId: "whoareyou-dev",
    storageBucket: "whoareyou-dev.appspot.com",
    messagingSenderId: "944348152216"
  }
  const firebaseApp = firebase.initializeApp(testFirebaseConfig);
  const testfirebaseauth = firebase.auth;
  const testfirebasestorage = firebase.storage();
  const testfirestore = firebaseApp.firestore();
  const settings = {timestampsInSnapshots: true};
  testfirestore.settings(settings);
  return {
    firebaseAuth: testfirebaseauth,
    firebaseStorage: testfirebasestorage,
    fireStore: testfirestore,
  };
});



import * as profileActions from'../profile';

const dispatch = jest.fn()

describe('profile actions test', () => {
  jest.setTimeout(10000)
  beforeAll( async () => {
    await firebase.auth().signInAnonymously();
  })
  afterAll( async () => {
    await firebase.auth().currentUser.delete()
  })

  test('editName test', async () => {
    await profileActions.editName(['asano', 'kouhei'], "ORE")(dispatch);
  })


  it('addTag, deleteTag test', () => {
    profileActions.addTag('TEST_TAG', 'Test')(dispatch);
    profileActions.deleteTag('TEST_TAG', 'Test')(dispatch);
  })

  it('updatePosition, updateProjects test', () => {
    profileActions.updatePosition('社員','アルバイト','Test')(dispatch);
    profileActions.updateProjects(['app'],['app', 'camera'], 'Test')(dispatch)
  })
})
