import { fireStore, firebaseStorage } from '../firebase';

import nowGroupList from '../components/nowGroupList';

const storageRef = firebaseStorage.ref();

const usersRef = fireStore.collection('users');

export const signUpAsUser = (uID, given, family, mei, sei, icon) => dispatch => {
  if (!given) {
    alert('Given name is empty.');
    return;
  }
  else if (!family) {
    alert('Famili name is empty.');
    return;
  }
  else if (!sei) {
    alert('姓が未入力です。');
    return;
  }
  else if (!mei) {
    alert('名が未入力です。');
    return;
  }
  else if (!icon) {
    alert('Icon image is empty.');
    return;
  }
  storageRef.child('icons/' + uID).put(icon)
    .on('state_changed', () => {
      storageRef.child('icons/' + uID).getDownloadURL().then((url) => {

        let nowGroup = {};
        for (let i in nowGroupList) nowGroup[nowGroupList[i]] = false;

        usersRef.doc(uID).set({
          given_en: given,
          family_en: family,
          given_ja: mei,
          family_ja: sei,
          icon: url,
          nowGroup: nowGroup
        })
          .catch(error => {
            dispatch({
              type: 'SIGNUP_ERROR',
              message: error.message,
            });
          })
      });
    });
}