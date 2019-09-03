import React, { Component } from 'react';
import { getArticleDetails, loveArticle } from '@/js/api.js'
import { formatDateTime } from '@/common/utils/utils.js'
import ReactMarkdown from 'react-markdown'
import CodeStyle from '@/view/edit-article/code-style.js'
import '@/common/less/article-details.less'
import 'github-markdown-css'

class ArticleDetails extends Component {
    constructor (props) {
        super(props)
        this.state = {
          details: {
            userName: 'xxx',
            createDate: '2019-10-10',
            readNumber: 0,
            title: 'title',
            loverArticle: '',
            markdown: '<div></div>'
          }
        }
        this.loverArticle = this.loverArticle.bind(this)
        this.goPinLun = this.goPinLun.bind(this)
        this.editArticle = this.editArticle.bind(this)
    }
    getData() {
      const { id } = this.props.match.params
      if (id) {
        getArticleDetails({
          id
        }).then(res => {
          if (res && res.data && res.data.code === 0) {
            const data = res.data.data
            this.setState({
              details: data
            })
          }
        })
      }
    }
    loverArticle() {
      loveArticle({
        id: this.state.details.id
      }).then(res => {
        if (res.data.code === 0) {
          const { details } = this.state
          details.userLoveStatus = res.data.data.status
          details.loveLen = Number(res.data.data.loveLen)
          this.setState({
            details
          })
        }
      })
    }
    goPinLun() {
      window.scrollTo()
    }
    editArticle() {
      this.props.history.push({
        pathname: '/edit-article',
        query: {
          id: this.state.details.id
        }
      })
    }
    componentDidMount() {
      this.getData()
    }
    render () {
        const { details } = this.state
        return (
          <div className="article-details_box">
            <div className="markdown-body_box">
              <div className="article-user_box">
                <div className="user-box_image">
                  <img src={details.userImage} />
                </div>
                <div className="article-user_text">
                  <span className="user-text_title">{details.userName}</span>
                  <p className="user-text_date">
                    <span>{formatDateTime(details.createDate)}</span>
                    <span>阅读: {details.articleReadCountLen || 0}</span>
                    {details.isEdit && <b className="article-edit_btn" onClick={this.editArticle}>编辑</b>}
                  </p>
                </div>
              </div>
              <h2 className="markdown-body_title">{details.title}</h2>
              <ReactMarkdown 
                  className="markdown-body"
                  skipHtml={true}
                  renderers={{code: CodeStyle}}
                  source={details.markdown}>
              </ReactMarkdown>
              <div className="article-left-tools">
                <div className="left-tools_box" onClick={this.loverArticle}>
                    <span className="left-tools_tip">{details.loveLen}</span> 
                    <i className={`iconfont icon-dianzan-copy left-tools_love ${details.userLoveStatus === '1' ? 'left-tools-love_article' : ''}`}></i>
                </div>
                <div className="left-tools_box" onClick={this.goPinLun}>
                    <i className="iconfont icon-pinglun left-tool_pinlun"></i>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default ArticleDetails