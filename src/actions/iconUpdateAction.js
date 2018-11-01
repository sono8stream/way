import { firebaseDB,firebaseStorage } from '../firebase';
import EXIF from 'exif-js';

const userRef = firebaseDB.ref('users');
const storageRef = firebaseStorage.ref();

export function updateIcon(icon, userKey) {
    dispatch => {
        if (!icon) return;

        optimizeImage(icon, dispatch, iconImage => {
            let key = 'icons/' + userKey;
            storageRef.child(key).put(iconImage).on('state_changed', () => {
                storageRef.child(key).getDownloadURL().then(url => {
                    userRef.child(userKey).update({
                        icon: url,
                    }).catch(error => {
                        if (error) {
                            dispatch({
                                type: 'UPDATE_IMAGE_ERROR',
                                message: error.message,
                            });
                        }
                    });
                });
            });
        });
    }
}

function optimizeImage(iconFile, dispatch,callback){
    let image = new Image();
    image.onload = () => {
        let width = image.width;
        let height = image.height;
        let maxWidth = 512;
        if (width < maxWidth) {
            dispatch({
                iconFile: iconFile,
                iconSrc: URL.createObjectURL(iconFile),
            });
            callback(iconFile);
        }
        else {
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');

            var orientation;

            EXIF.getData(iconFile, () => {
                orientation = iconFile.exifdata.Orientation;

                var image_aspect, canvas_width, canvas_height, draw_width, draw_height;
                //アスペクト取得
                image_aspect = (orientation == 5 || orientation == 6 || orientation == 7 || orientation == 8) ? image.width / image.height : image.height / image.width;

                canvas_width = image.width;
                canvas_height = Math.floor(canvas_width * image_aspect);

                // リサイズ
                const scale = maxWidth / canvas_width;
                const dst_width = maxWidth;
                const dst_height = canvas_height * scale;
                canvas.width = dst_width;
                canvas.height = dst_height;
                ctx.scale(scale, scale)

                // iPhoneで撮った写真はブラウザ上で回転してしまう。
                // exifに応じて画像の変換(上下左右反転と回転）

                var draw_width = canvas_width;
                var draw_height = canvas_height;

                switch (orientation) {
                    case 2:
                        ctx.transform(-1, 0, 0, 1, canvas_width, 0);
                        break;

                    case 3:
                        ctx.transform(-1, 0, 0, -1, canvas_width, canvas_height);
                        break;

                    case 4:
                        ctx.transform(1, 0, 0, -1, 0, canvas_height);
                        break;

                    case 5:
                        ctx.transform(-1, 0, 0, 1, 0, 0);
                        ctx.rotate((90 * Math.PI) / 180);
                        draw_width = canvas_height;
                        draw_height = canvas_width;
                        break;

                    case 6:
                        ctx.transform(1, 0, 0, 1, canvas_width, 0);
                        ctx.rotate((90 * Math.PI) / 180);
                        draw_width = canvas_height;
                        draw_height = canvas_width;
                        console.log("6!")
                        break;

                    case 7:
                        ctx.transform(-1, 0, 0, 1, canvas_width, canvas_height);
                        ctx.rotate((-90 * Math.PI) / 180);
                        draw_width = canvas_height;
                        draw_height = canvas_width;
                        break;

                    case 8:
                        ctx.transform(1, 0, 0, 1, 0, canvas_height);
                        ctx.rotate((-90 * Math.PI) / 180);
                        draw_width = canvas_height;
                        draw_height = canvas_width;
                        break;

                    default:
                        break;
                }

                ctx.drawImage(image, 0, 0, draw_width, draw_height)

                // 変換後の画像をステートに設定
                let transformedImage = canvas.toDataURL('image/png');
                canvas.toBlob(blob => {
                    dispatch({
                        iconFile: blob,
                        iconSrc: transformedImage
                    });
                    callback(blob);
                });
            });
        }
    };
    image.src = URL.createObjectURL(iconFile);
}

// iPhoneで撮った写真はブラウザ上で回転してしまう。
// exifに応じて画像の変換(上下左右反転と回転）
/*
function alignImageOrient(iconFile,ctx){
    orientation = iconFile.exifdata.Orientation;

    switch (orientation) {
        case 2:
            ctx.transform(-1, 0, 0, 1, canvas_width, 0);
            break;

        case 3:
            ctx.transform(-1, 0, 0, -1, canvas_width, canvas_height);
            break;

        case 4:
            ctx.transform(1, 0, 0, -1, 0, canvas_height);
            break;

        case 5:
            ctx.transform(-1, 0, 0, 1, 0, 0);
            ctx.rotate((90 * Math.PI) / 180);
            draw_width = canvas_height;
            draw_height = canvas_width;
            break;

        case 6:
            ctx.transform(1, 0, 0, 1, canvas_width, 0);
            ctx.rotate((90 * Math.PI) / 180);
            draw_width = canvas_height;
            draw_height = canvas_width;
            break;

        case 7:
            ctx.transform(-1, 0, 0, 1, canvas_width, canvas_height);
            ctx.rotate((-90 * Math.PI) / 180);
            draw_width = canvas_height;
            draw_height = canvas_width;
            break;

        case 8:
            ctx.transform(1, 0, 0, 1, 0, canvas_height);
            ctx.rotate((-90 * Math.PI) / 180);
            draw_width = canvas_height;
            draw_height = canvas_width;
            break;

        default:
            break;
    }

    if (orientation >= 5) {
        ctx.rotate((-90 * Math.PI) / 180);
        draw_width = canvas_height;
        draw_height = canvas_width;
    }
}
*/

function resizeImage(){

}