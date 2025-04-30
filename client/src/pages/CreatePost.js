/*import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill';
import { useState } from 'react';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']  // remove formatting button
    ]
  };
  
  // Define formats (allowed tags)
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

 function CreatePost(){
    const [title,setTitle] = useState('')
    const [summary,setSummary] = useState('')
    const [content,setContent] = useState('')
    const [files,setFiles] =  useState('')
     
    function createNewPost(e){
      const data = new FormData()
      data.set('title',title)
      data.set('summary',summary)
      data.set('content',content)
      data.set('file',files[0])
        e.preventDefault();
        fetch('http://localhost:4000/post',{
          method:'POST',
          body:data,

        })
    }

       return( 
        <form onSubmit={createNewPost}>
            <input type="title" placeholder={'Title'} value={title} onChange={e=>setTitle(e.target.value)}/>
            <input type="summary" placeholder={'Summary'} value={summary} onChange={e=>setSummary(e.target.value)}/>
            <input type="file" value={files} onChange={e=>setFiles(e.target.files)}/>

            <ReactQuill value={content} 
            onChange={newValue=>setContent(newValue)} 
            modules={modules} formats={formats}/>

            <button style={{marginTop:'5px'}}>Create post</button>
        </form>
       )
}

export default CreatePost
*/

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
];

function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null); 
  const [redirect,setRedirect] = useState(false)

  async function createNewPost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files?.[0]);

    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials:'include'
    });

    // Optional: handle response
    if (response.ok) {
      alert('Post created!');
      setRedirect(true)
    } else {
      alert('Failed to create post.');
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFiles(e.target.files)}
      />

      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />

      <button style={{ marginTop: '5px' }}>Create post</button>
    </form>
  );
}

export default CreatePost;
