import React, {Component} from 'react'

class Upload extends Component{
    handleChange = event => {
        return;
    }
    handleSubmit = event => {
        return;
    }
    render(){
        return(
            <form onsubmit={e => this.handleSubmit(e)}>
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