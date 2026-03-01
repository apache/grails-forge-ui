// CodePreview.js
import React, {
  useState,
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
} from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import TreeItem from '@material-ui/lab/TreeItem'
import TreeView from '@material-ui/lab/TreeView'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import messages from '../../constants/messages.json'
import { PREVIEW_SHORTCUT } from '../../constants/shortcuts'
import {
  fullyQualifySharableLink,
  ACTIVITY_KEY,
  PREVIEW_ACTIVITY,
} from '../../helpers/Routing'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'

import { useSharableLink, useStarterForm } from '../../state/store'
import { capitalize, makeNodeTree } from '../../utility'

import CopyToClipboard from '../CopyToClipboard'
import TooltipButton, { TooltipWrapper } from '../TooltipButton'

const CodePreview = ({ theme = 'light', disabled, onLoad, onClose }, ref) => {
  const { gorm, servlet } = useStarterForm()
  const sharable = useSharableLink()

  const [showing, setShowing] = useState(null)
  const [preview, setPreview] = useState({})
  const open = Object.keys(preview).length > 0

  useKeyboardShortcuts(PREVIEW_SHORTCUT.keys, onLoad, disabled)

  useImperativeHandle(ref, () => ({
    show: async (json, showing) => {
      setShowing(showing || 'README.md')
      const nodes = makeNodeTree(json.contents)
      setPreview(nodes)
    },
  }))

  const [currentFile, setCurrentFile] = useState({
    contents: null,
    language: null,
    path: null,
  })

  const { defaultSelected, defaultExpanded } = useMemo(
    () => extractDefaults(showing),
    [showing]
  )

  const shareLink = useMemo(() => {
    let link = fullyQualifySharableLink(sharable, {
      [ACTIVITY_KEY]: PREVIEW_ACTIVITY,
    })
    if (currentFile.path) {
      link += `&showing=${currentFile.path}`
    }
    return link
  }, [sharable, currentFile.path])

  const onModalClose = () => {
    setPreview({})
    setCurrentFile({
      contents: null,
      language: null,
      path: null,
    })
    setShowing(null)
    if (onClose instanceof Function) {
      onClose()
    }
  }

  const handleFileSelection = (key, contents, path) => {
    if (typeof contents === 'string') {
      let idx = key.lastIndexOf('.')
      let language
      if (idx > -1) {
        language = key.substring(idx + 1)
        if (language === 'gradle') {
          language = 'groovy'
        }
        if (language === 'bat') {
          language = 'batch'
        }
        if (language === 'kt') {
          language = 'kotlin'
        }
      } else {
        language = 'bash'
      }
      setCurrentFile({ contents, language, path })
    } else {
      // File cannot be previewed (null or object contents)
      setCurrentFile({ contents: null, language: null, path })
    }
  }

  function extractDefaults(path) {
    if (!path || typeof path !== 'string') {
      return {
        defaultSelected: 'root',
      }
    }

    // nodeIds in renderTree are built as `/${key}` so prefix with /
    const fullPath = path.startsWith('/') ? path : '/' + path
    const parts = fullPath.split('/').filter((i) => i)
    const defaultExpanded = []
    // Build expanded paths from root down (e.g. /src, /src/main, /src/main/groovy)
    for (let i = 1; i <= parts.length; i++) {
      defaultExpanded.push('/' + parts.slice(0, i).join('/'))
    }
    return {
      defaultSelected: fullPath,
      defaultExpanded,
    }
  }
 
   useEffect(() => {
    if (typeof showing !== 'string') {
      return
    }
    const parts = showing.split('/').filter((i) => i)
    let contents = preview
    let key = ''
    while (contents && typeof match !== 'string' && parts.length) {
      key = parts.shift()
      contents = contents[key]
    }
    if (key && contents) {
      const nodeId = showing.startsWith('/') ? showing : '/' + showing
      handleFileSelection(key, contents, nodeId)
    }
  }, [preview, showing])

  const renderTree = (nodes, rootKey = '') => {
    if (nodes instanceof Object) {
      return Object.keys(nodes)
        .sort(function order(key1, key2) {
          let key1Object = typeof nodes[key1] === 'object'
          let key2Object = typeof nodes[key2] === 'object'
          if (key1Object && !key2Object) {
            return -1
          } else if (!key1Object && key2Object) {
            return 1
          } else {
            if (key1 < key2) return -1
            else if (key1 > key2) return +1
            else return 0
          }
        })
        .map((key) => {
          const children = nodes[key]
          const nodeId = `${rootKey}/${key}`
          const isFile = typeof children === 'string'
          const isFolder = typeof children === 'object' && children !== null
          const className = isFile || isFolder ? '' : 'non-previewable'
          return (
            <TreeItem
              key={nodeId}
              nodeId={nodeId}
              label={key}
              className={className}
              onClick={() => handleFileSelection(key, children, nodeId)}
            >
              {renderTree(children, nodeId)}
            </TreeItem>
          )
        })
    }
  }

  return (
    <React.Fragment>
      <TooltipButton
        tooltip={messages.tooltips.preview}
        disabled={disabled}
        className={theme}
        style={{ marginRight: '5px', width: '100%' }}
        onClick={onLoad}
        tabIndex={1}
      >
        <Icon className="action-button-icon" style={{ marginRight: 8 }}>
          search
        </Icon>
        Preview
      </TooltipButton>
      <Dialog
        open={open}
        onClose={onModalClose}
        maxWidth="lg"
        fullWidth
        className={`preview ${theme}`}
        PaperProps={{ className: `preview ${theme}` }}
      >
        <DialogTitle>
          {'Previewing a Grails application using ' +
          ' application using ' +
          capitalize(servlet) + ', ' + capitalize(gorm)}
        </DialogTitle>
        <DialogContent>
          <Grid container className="grid-container">
            <Grid
              item
              xs={3}
              className={'grid-column'}
              style={{ borderRight: '1px solid' }}
            >
              <TreeView
                key={`${defaultSelected}-${Object.keys(preview).length}`}
                defaultCollapseIcon={<Icon>folder_open</Icon>}
                defaultExpandIcon={<Icon>folder</Icon>}
                defaultEndIcon={<Icon>description</Icon>}
                defaultExpanded={defaultExpanded}
                defaultSelected={defaultSelected}
              >
                {renderTree(preview)}
              </TreeView>
            </Grid>
            <Grid item xs={9} className={'grid-column'}>
              {currentFile.contents ? (
                <SyntaxHighlighter
                  className="codePreview"
                  language={currentFile.language}
                  style={theme === 'light' ? prism : darcula}
                  showLineNumbers={true}
                >
                  {currentFile.contents}
                </SyntaxHighlighter>
              ) : currentFile.path ? (
                <div style={{ padding: '16px', color: '#999' }}>
                  {currentFile.contents === ''
                    ? 'This file has no content.'
                    : 'This file cannot be previewed.'}
                </div>
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div className="code-preview footer-wrapper">
            <div className={currentFile.contents ? '' : 'hidden'}>
              <TooltipWrapper tooltip="Copy a link back to current file">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '1em',
                  }}
                >
                  <CopyToClipboard value={shareLink}></CopyToClipboard>
                  Link to This
                </div>
              </TooltipWrapper>
            </div>
            <Button onClick={onModalClose}>
              Close
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default forwardRef(CodePreview)
