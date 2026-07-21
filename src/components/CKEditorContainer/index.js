/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { Toast } from 'service/toast';

export default function CKEditorContainer({ onChange, message = "" }) {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          let formData = new FormData();
          loader.file.then((file) => {
            formData.append("file", file);
            formData.append("upload_preset", "ma7nge92");
            axios
              .post('https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload',
                formData,
                {
                  onUploadProgress: (progressEvent) => {
                    let percent = Math.round(
                      (progressEvent.uploaded / progressEvent.total) * 100
                    );
                    if (percent === 25 || percent === 50 || percent === 75 || percent === 100) {
                      Toast({ message: "Uploaded " + percent + "%", type: "success", time: 500 })
                    }
                  },
                })
              .then((response) => {
                resolve({
                  default: response.data.secure_url
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        data={message}
        onReady={editor => {
          // You can store the "editor" and use when it is needed.
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { value: data, name: "message", label: "message" } })
        }}
        onBlur={(event, editor) => {
          //console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          //console.log('Focus.', editor);
        }}
        style={{ minHeight: 250 }}
        config={{
          extraPlugins: [uploadPlugin]
        }}
      />
    </div>
  );
}