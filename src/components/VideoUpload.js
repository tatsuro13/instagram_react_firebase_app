import React, {Component} from 'react'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore';
import _ from 'lodash'

class Upload extends Component{
    constructor(props){
        super(props);
        this.state = {video: null}
    }

    handleChange = event => {
        event.preventDefault();
        const video = event.target.files[0];

        this.setState({video});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.fileUpload(this.state.video);
    }

    async fileUpload(video) {
        try{
            const userUid = firebase.auth().currentUser.uid;
            const filePath = `videos/${userUid}/${video.name}`;
            const videoStorageRef = firebase.storage().ref(filePath);
            const idToken = await
            firebase.auth().currentUser.getIdToken(true);
            const metadataForStorage = {
                customMetadata: {
                    idToken: idToken
                }
            };
            const fileSnaopshot = await
            videoStorageRef.put(video, metadataForStorage);

            // mp4以外の動画は、cloudFunctions上で、トランスコードした後にメタデータをFirestoreに保存する
            if(video.type === 'video/mp4'){
                const downloadURL = await
                videoStorageRef.getDownloadURL();
                let metadataForFirestore = _.omitBy(fileSnaopshot.metadata, _.isEmpty);
                metadataForFirestore = Object.assign(metadataForFirestore, {downloadURL: downloadURL});

                this.saveVideoMetadata(metadataForFirestore)
            }

            if(fileSnaopshot.state === 'success'){
                console.log(fileSnaopshot);
                this.setState({video: null});
            }else{
                console.log(fileSnaopshot);
                alert('ファイルのアップロードに失敗しました')
            }
        }catch(error){
            console.log(error);
            return;
        }
    }

    async saveVideoMetadata(metadata){
        const userUid = firebase.auth().currentUser.uid;
        const videoRef = firebase.firestore().doc(`users/${userUid}`).collection('videos').doc();
        metadata = Object.assign(metadata, {uid: videoRef.id})
        
        await videoRef.set(metadata, {merge: true});
    }

    render(){
        return(
            <form onSubmit={e => this.handleSubmit(e)}>
                <h2>Video Uplolad</h2>
                <input type="file" accept="video/*" onChange={e => this.handleChange(e)} />
                <button type="submit">
                    Upload Video
                </button>
            </form>
        );
    }
}

export default Upload;