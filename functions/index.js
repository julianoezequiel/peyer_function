// const fetch = require('node-fetch')

// const functions = require('firebase-functions')

// const request = require('request-promise')
// const cheerio = require('cheerio')
// const iconv = require('iconv-lite')

// // The Firebase Admin SDK to access Firestore.
// const admin = require('firebase-admin')
// admin.initializeApp()





// //http://www.peyerbern.ch/Einsatzliste.html
// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //

// const url = 'https://www.peyerbern.ch/Einsatzliste.html'

// exports.scheduledFunction = functions.pubsub
//   .schedule('every 1 minutes')
//   .onRun(async context => {
//     // const users = await getInactiveUsers()
//     // console.log('inativos ' + JSON.stringify(users))
//     // functions.logger.log('User cleanup finished')
//     const site = await buscarSite()
//     // functions.logger.debug('site ' + site)
//     return
//   })

// async function buscarSite () {

//   var encoding = 'iso-8859-1';

//   const result = await request.get(url)
//   const $ = cheerio.load(result,{
//     decodeEntities: false
//   })
//   $('body > div > table > tbody > tr > td').each((index, element) => {
//     console.log('Index ' + index + ' - ' + iconv.decode($(element).text(),encoding))
//   })
//   console.log("bbb")
//   // console.log($('body > div > table > tbody > tr > td').text())
//   // fetch(url)
//   //   .then(function (response) {
//   //     result = response.json()
//   //   })
//   //   .then(function (data) {
//   //     console.log(data)
//   //   })
//   //   .catch(function () {
//   //     console.log('Booo')
//   //   })
//   // functions.logger.info(result, { structuredData: true })
//   return result
// }

// async function getInactiveUsers (users = [], nextPageToken) {
//   const result = await admin.auth().listUsers(1000, nextPageToken)
//   // Find users that have not signed in in the last 30 days.
//   const inactiveUsers = result.users.filter(
//     user =>
//       Date.parse(
//         user.metadata.lastRefreshTime || user.metadata.lastSignInTime
//       ) <
//       Date.now() - 30 * 24 * 60 * 60 * 1000
//   )

//   // Concat with list of previously found inactive users if there was more than 1000 users.
//   users = users.concat(inactiveUsers)

//   // If there are more users to fetch we fetch them.
//   if (result.pageToken) {
//     return getInactiveUsers(users, result.pageToken)
//   }

//   return result.users
// }

// // exports.helloWorld = functions.runWith({failurePolicy: true}).https.onRequest((request, response) => {
// //     const result = {};
// //    fetch(url).then(function(response) {
// //         result = response.json();
// //     }).then(function(data) {
// //         console.log(data);
// //     }).catch(function() {
// //         console.log("Booo");
// //     });
// //     functions.logger.info(result, {structuredData: true});
// //   response.send(result);
// // });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
// [END import]

exports.storage = functions.storage.object().onFinalize(async (object) => {
  // [END generateThumbnailTrigger]
  // [START eventAttributes]
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.mediaLink; // File path in the bucket.
  console.log("filePath",filePath);
  console.log(object);
  const contentType = object.contentType; // File content type.
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
  // [END eventAttributes]

  // [START stopConditions]

  // Get the file name.
  const fileName = path.basename(filePath);
  console.log("fileName",fileName);

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), "teste.txt");
  console.log("tempFilePath",tempFilePath)
  const metadata = {
    contentType: contentType,
  };
  await bucket.file(filePath).download({ destination: tempFilePath });
 
  // const thumbFilePath = path.join(path.dirname(filePath), fileName);
  // // Uploading the thumbnail.
  // await bucket.upload(tempFilePath, {
  //   destination: thumbFilePath,
  //   metadata: metadata,
  // });
  // // Once the thumbnail has been uploaded delete the local file to free up disk space.
  // return fs.unlinkSync(tempFilePath);
  // [END thumbnailGeneration]
  console.log("arquivo recebido")
});
