'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});
const APP_NAME = 'WhoAreYou';


exports.newUserEmailNotification = functions.firestore.document('users/{UID}').onCreate((snap, context) => {
  const newUserData = snap.data();
  const newUserIcon = newUserData.icon;
  const newUserID = context.params.UID;
  const newUserFullName = newUserData.given_en;

  return firestore.collection('accounts').get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data())
      console.log(doc.data().email)
      console.log(doc.id)
      if(doc.id !== newUserID){
        return sendNewComerEmail(doc.data().email, newUserFullName, newUserIcon);
      }
    });
  })
})


function sendNewComerEmail(email, newUserFullName, newUserIcon) {
  const mailOptions = {
    from: `${APP_NAME} <kk.asano.luxy@gmail.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${newUserFullName} joined us!`;
  mailOptions.html = `
    <h2>
      ${newUserFullName || ''} joined us!
    </h2>
    <p> Let's comment on ${newUserFullName || ''}!</p>
    <a href="https://way.satudora.co/">
      <img src="${newUserIcon}" />
    </a>`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New comer email sent to:', email);
  });
}
