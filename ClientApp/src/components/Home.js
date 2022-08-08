import React, { Component } from 'react';
import axios from 'axios';

export class Home extends Component {
  static displayName = Home.name;
  state = {
      selectedFile: null,
      fileUploadedSuccessfully: false
  }
  onFileChange = event => {
      this.setState({ selectedFile: event.target.files[0] });
  }
  onFileUpload = () => {
      const formData = new FormData();
      formData.append(
          "demo file",
          this.state.selectedFile,
          this.state.selectedFile.name
      )
      axios.post("https://7hjfrglow0.execute-api.ap-northeast-2.amazonaws.com/prod/file-upload", formData).then(() => {
          this.setState({ selectedFile: null });
          this.setState({ fileUploadedSuccessfully: true });
      })
  }
  fileData = () => {
      if (this.state.selectedFile) {
          return (
              <div>
                  <h2>파일 세부정보</h2>
                  <p>파일명: {this.state.selectedFile.name}</p>
                  <p>파일유형: {this.state.selectedFile.type}</p>
                  <p>Last Modified: {" "}
                      {this.state.selectedFile.lastModifiedDate.toDateString()}
                  </p>
              </div>
          )
      } else if (this.state.fileUploadedSuccessfully) {
          return (
              <div>
                  <br />
                  <h4>파일 정상 업로드!</h4>
              </div>
          )
      } else {
          return (
              <div>
                  <br />
                  <h4> 파일을 선택하고 업로드 버튼을 클릭해 주세요.</h4>
              </div>
          )
      }
  }
    
  render() {
      return (
          <div className='container'>
              <h2>파일 업로드 페이지</h2>
              <div>
                  <br></br>
                  <input type="file" onChange={this.onFileChange} />
                  <button onClick={this.onFileUpload}>
                      파일 업로드
                  </button>
              </div>
              {this.fileData()}
          </div>
      )
  }
}
