import React, { Component } from 'react';
import axios from 'axios';
const fixed_arr = ['bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'];
const fixed_dic = {};
const URL = "https://rldbrg3dt9.execute-api.ap-northeast-2.amazonaws.com/simple/dynamodb"

export class FileExtensionsIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            extensions: [],
            loading: true,
            name: '',
            checkedList:[]
        };
        this.deleteBy = this.deleteBy.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    // 페이지가 로드되었을 때 Web API 호출해서 JSON 데이터 가져오기: OnInitialized() 
    componentDidMount() {
        this.populateFileExtensionsDataWithAxiosAsync();
    }
    // 확장자 리스트 테이블 출력
    renderFixedFileExtensionsTable(extensions) {
        fixed_arr.map(farr => {
            fixed_dic[farr] = false;
            return extensions.forEach(ex => {if (farr === ex.Name) fixed_dic[farr] = true;})
        });
        return (
            <table className='table table-striped fixed' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>고정 확장자</th>
                    </tr>
                </thead>
                <tbody>
                    {fixed_arr.map(fixedFileExtension =>
                        <tr className='flexComtainer' key={fixedFileExtension} >
                            <td className="text-nowrap cell">
                                <input type="checkbox" checked={fixed_dic[fixedFileExtension]} onChange={() => {
                                        fixed_dic[fixedFileExtension] ? this.deleteBy(fixedFileExtension)
                                        : this.createBy(fixedFileExtension)
                                }}></input>
                                &nbsp;{fixedFileExtension}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    renderFileExtensionsTable(extensions) {
        return (
            <div className='customed'>
                <div className='customedTr'>
                    커스텀 확장자                    
                </div>
                <div className='flex-container'>
                    {extensions.map(fileExtension =>
                        <div className="text-nowrap cell" key={fileExtension.Name} id={fileExtension.Name}>{fileExtension.Name}&nbsp;
                                <button className="btn btn-sm btn-danger" onClick={() => this.deleteBy(fileExtension.Name)}>X</button>
                            </div>
                    )}
                </div>
            </div>
        );
    }
    handleSubmit(e) {
        e.preventDefault();
        var Item = {
            'Name': this.state.name,
        }
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "TableName": "FileExtensions",
                Item
            })
        }).then(resp => {
            window.confirm("추가되었습니다.")
        })
            .catch(err => console.log(err))
    }
    createBy(Name) {
        var Item = {
            'Name': Name
        }
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "TableName": "FileExtensions",
                Item
            })
        }).then(resp => {
            window.confirm("추가되었습니다.")
            console.log(resp);
        })
            .catch(err => console.log(err))
    }
    deleteBy(Name) {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            document.getElementById(Name).remove();
            var Key = {
                'Name': Name
            }
            fetch(URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "TableName": "FileExtensions",
                    Key
                })
            }).then(resp => {
                console.log(resp);
            })
                .catch(err => console.log(err))
        }
        else {
            return false;
        }
    }

    handleChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }
    

    render() {
        let fixedContents = this.state.loading
            ? <p><em>Loading....</em></p>
            : this.renderFixedFileExtensionsTable(this.state.extensions);
        let customedContents = this.state.loading
            ? <p><em>Loading....</em></p>
            : this.renderFileExtensionsTable(this.state.extensions);

        return (
            <div>
                <h1>Add to Block FileExtension</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group"><input type="text" className="form-control"
                    placeholder="Enter Name"
                    value={this.state.name}
                    onChange={this.handleChangeName}
                    /><button type="submit" className="btn btn-primary">Submit</button></div>
                </form>
                <h2 style={{ fontStyle: "italic" }}>차단 확장자 목록입니다.</h2>
                <div>{fixedContents}</div>
                <div>{customedContents}</div>
            </div>
        );
    }
    
    // index
    async populateFileExtensionsDataWithAxiosAsync() {
        const response = await axios.get(URL);
        const data = response.data;
        this.setState({ extensions: data.Items, loading: false });
    }

    
}
