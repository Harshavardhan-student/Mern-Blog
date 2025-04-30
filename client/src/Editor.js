import ReactQuill from 'react-quill';

function Editor({value,onChange}){

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
      
   return(
        <ReactQuill
             value={value}
             theme={'snow'}
             onChange={onChange}
             modules={modules}
             formats={formats}
           />
     
   )
}

export default Editor