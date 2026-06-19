import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { FiList, FiType, FiArrowLeft, FiSliders, FiInfo, FiX, FiImage, FiCamera, FiFileText, FiUpload } from 'react-icons/fi';
import api from '../../lib/axios';

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
});

const ResizableImageNode = (props) => {
  const { node, updateAttributes, selected } = props;
  const imgRef = useRef(null);

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imgRef.current.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const currentX = moveEvent.clientX;
      const diffX = currentX - startX;
      updateAttributes({ size: `${Math.max(50, startWidth + diffX)}px` });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const spacingMap = { s: '8px', m: '16px', l: '28px', none: '0px' };
  const spacingVal = spacingMap[node.attrs.spacing] || '0px';
  const alignStyle =
    node.attrs.align === 'left'
      ? { float: 'left', marginTop: spacingVal, marginBottom: spacingVal, marginRight: spacingVal, marginLeft: 0 }
      : node.attrs.align === 'right'
      ? { float: 'right', marginTop: spacingVal, marginBottom: spacingVal, marginLeft: spacingVal, marginRight: 0 }
      : { display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: spacingVal, marginBottom: spacingVal };
  const alignClass = '';

  return (
    <NodeViewWrapper 
      as="span" 
      className={`relative inline-block group`}
      style={alignStyle}
    >
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        style={{ width: node.attrs.size }}
        className={`${selected ? 'outline outline-2 outline-[#0052cc] outline-offset-2' : ''} rounded-xl shadow-sm max-w-full`}
        draggable="true"
        data-drag-handle
      />
      {selected && (
        <div 
          onMouseDown={startResize}
          className="absolute -right-2 -bottom-2 w-4 h-4 bg-white border-2 border-[#0052cc] rounded-full cursor-se-resize shadow-md z-50 hover:scale-125 transition-transform"
        ></div>
      )}
    </NodeViewWrapper>
  );
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: '100%',
        parseHTML: element => {
          return element.getAttribute('data-size') || element.style.width || '100%';
        },
        renderHTML: attributes => {
          return { 
            'data-size': attributes.size,
            style: `width: ${attributes.size}; height: auto;` 
          };
        }
      },
      spacing: {
        default: 'none',
        parseHTML: element => {
          if (element.getAttribute('data-spacing')) return element.getAttribute('data-spacing');
          if (element.classList.contains('m-4')) return 's';
          if (element.classList.contains('m-8')) return 'm';
          if (element.classList.contains('m-12')) return 'l';
          return 'none';
        },
        renderHTML: attributes => {
          const classes = {
            'none': '',
            's': 'm-4',
            'm': 'm-8',
            'l': 'm-12'
          };
          return { 
            'data-spacing': attributes.spacing,
            class: classes[attributes.spacing] || '' 
          };
        }
      },
      align: {
        default: 'center',
        parseHTML: element => {
          if (element.getAttribute('data-align')) return element.getAttribute('data-align');
          if (element.classList.contains('float-left')) return 'left';
          if (element.classList.contains('float-right')) return 'right';
          return 'center';
        },
        renderHTML: attributes => {
          const classes = {
            'left': 'float-left',
            'center': 'mx-auto block',
            'right': 'float-right'
          };
          return { 
            'data-align': attributes.align,
            class: classes[attributes.align] || classes.center 
          };
        }
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode);
  }
});

const ImageMenu = ({ editor }) => {
  if (!editor) return null;

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }} 
      shouldShow={({ editor }) => editor.isActive('image')}
    >
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl shadow-lg border border-gray-200">
        <span className="text-[11px] font-bold text-gray-400 px-2 uppercase tracking-wider">Size</span>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { size: '25%' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').size === '25%' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>25%</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { size: '50%' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').size === '50%' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>50%</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { size: '75%' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').size === '75%' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>75%</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { size: '100%' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').size === '100%' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>100%</button>

        <div className="w-px h-5 bg-gray-200 mx-1"></div>
        <span className="text-[11px] font-bold text-gray-400 px-2 uppercase tracking-wider">Spacing</span>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { spacing: 'none' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').spacing === 'none' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>None</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { spacing: 's' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').spacing === 's' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>S</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { spacing: 'm' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').spacing === 'm' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>M</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { spacing: 'l' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').spacing === 'l' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>L</button>

        <div className="w-px h-5 bg-gray-200 mx-1"></div>
        <span className="text-[11px] font-bold text-gray-400 px-2 uppercase tracking-wider">Align</span>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').align === 'left' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>Left</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').align === 'center' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>Center</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()} className={`px-2 py-1 text-[12px] font-bold text-gray-700 hover:bg-gray-100 rounded-lg ${editor.getAttributes('image').align === 'right' ? 'bg-gray-100 text-[#0052cc]' : ''}`}>Right</button>
      </div>
    </BubbleMenu>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/media/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      editor.chain().focus().setImage({ src: res.data.url }).run();
    } catch (error) {
      console.error('Image upload failed', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="sticky top-0 z-40 flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-sm mb-4">
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors hover:bg-gray-50 text-gray-500 disabled:opacity-30`}
        title="Undo"
      >
        <span className="material-symbols-outlined text-[18px]">undo</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors hover:bg-gray-50 text-gray-500 disabled:opacity-30`}
        title="Redo"
      >
        <span className="material-symbols-outlined text-[18px]">redo</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 my-auto"></div>

      {/* Font Family & Size */}
      <select
        onChange={(e) => {
          if (e.target.value === 'Default') {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(e.target.value).run();
          }
        }}
        value={editor.getAttributes('textStyle').fontFamily || 'Default'}
        className="h-8 px-2 rounded-lg text-[13px] bg-transparent hover:bg-gray-50 border-none cursor-pointer outline-none text-gray-700 font-semibold focus:ring-0"
      >
        <option value="Default">Default</option>
        <option value="Arial, Helvetica, sans-serif">Arial</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Impact, Charcoal, sans-serif">Impact</option>
        <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
        <option value="'Times New Roman', Times, serif">Times New Roman</option>
        <option value="Verdana, Geneva, sans-serif">Verdana</option>
      </select>

      <select
        onChange={(e) => {
          if (e.target.value === 'default') {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(e.target.value).run();
          }
        }}
        value={editor.getAttributes('textStyle').fontSize || 'default'}
        className="h-8 px-2 rounded-lg text-[13px] bg-transparent hover:bg-gray-50 border-none cursor-pointer outline-none text-gray-700 font-semibold focus:ring-0"
      >
        <option value="default">Size</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
        <option value="28px">28</option>
        <option value="32px">32</option>
        <option value="36px">36</option>
        <option value="48px">48</option>
      </select>

      <div className="w-px h-6 bg-gray-200 mx-1 my-auto"></div>

      {/* Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] font-bold transition-colors ${editor.isActive('bold') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] italic font-serif transition-colors ${editor.isActive('italic') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] underline transition-colors ${editor.isActive('underline') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Underline"
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] line-through transition-colors ${editor.isActive('strike') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Strikethrough"
      >
        S
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 my-auto"></div>

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Align Left"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_left</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Align Center"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_center</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Align Right"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_right</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Justify"
      >
        <span className="material-symbols-outlined text-[18px]">format_align_justify</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 my-auto"></div>

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive('bulletList') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Bullet List"
      >
        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive('orderedList') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Ordered List"
      >
        <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 my-auto"></div>

      {/* Blocks */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive('blockquote') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Quote"
      >
        <span className="material-symbols-outlined text-[18px]">format_quote</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive('codeBlock') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Code Block"
      >
        <span className="material-symbols-outlined text-[18px]">code_blocks</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors hover:bg-gray-50 text-gray-500`}
        title="Horizontal Rule"
      >
        <span className="material-symbols-outlined text-[18px]">horizontal_rule</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 my-auto"></div>

      {/* Media & Links */}
      <button
        type="button"
        onClick={setLink}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors ${editor.isActive('link') ? 'bg-[#0052cc] text-white shadow-sm' : 'hover:bg-gray-50 text-gray-500'}`}
        title="Add Link"
      >
        <span className="material-symbols-outlined text-[18px]">link</span>
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploadingImage}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors hover:bg-gray-50 text-gray-500 disabled:opacity-50`}
        title="Add Image"
      >
        {isUploadingImage ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span className="material-symbols-outlined text-[18px]">image</span>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={addImage}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[16px] transition-colors hover:bg-gray-50 text-gray-500`}
        title="Clear Formatting"
      >
        <span className="material-symbols-outlined text-[18px]">format_clear</span>
      </button>
    </div>
  );
};

const ArticleEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    coverImage: '',
    categoryId: '',
    published: false,
    tags: [],
    expertTip: '',
    pdfReportUrl: '',
    pdfReportSize: '',
    customAuthorName: '',
    customAuthorBio: '',
    customAuthorAvatar: '',
  });

  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Mobile toggle

  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: 'Start writing your publication...',
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg lg:prose-xl xl:prose-2xl max-w-none focus:outline-none min-h-[60vh] pb-32 prose-headings:font-display-xl prose-headings:text-gray-900 prose-p:text-gray-600 leading-relaxed',
      },
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchArticle = async () => {
    try {
      const res = await api.get(`/articles/id/${id}`);
      const article = res.data;
      setFormData({
        title: article.title,
        excerpt: article.excerpt || '',
        coverImage: article.coverImage || '',
        categoryId: article.categoryId || '',
        published: article.published,
        tags: article.tags?.map(t => t.name) || [],
        expertTip: article.expertTip || '',
        pdfReportUrl: article.pdfReportUrl || '',
        pdfReportSize: article.pdfReportSize || '',
        customAuthorName: article.customAuthorName || '',
        customAuthorBio: article.customAuthorBio || '',
        customAuthorAvatar: article.customAuthorAvatar || '',
      });
      if (editor) {
        editor.commands.setContent(article.content);
      }
    } catch (error) {
      console.error('Failed to fetch article', error);
      alert('Failed to load article data.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file to local backend
      const res = await api.post('/media/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update coverImage field
      setFormData(prev => ({ ...prev, coverImage: res.data.url }));
    } catch (error) {
      console.error('Image upload failed', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const authorAvatarInputRef = useRef(null);

  const handleAuthorAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await api.post('/media/upload-file', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, customAuthorAvatar: res.data.url }));
    } catch (error) {
      console.error('Author avatar upload failed', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
      if (authorAvatarInputRef.current) {
        authorAvatarInputRef.current.value = '';
      }
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/media/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      setFormData(prev => ({ 
        ...prev, 
        pdfReportUrl: res.data.url,
        pdfReportSize: sizeInMB
      }));
    } catch (error) {
      console.error('PDF upload failed', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.target.value = '';
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    setIsSaving(true);
    const htmlContent = editor.getHTML();
    
    const payload = {
      ...formData,
      content: htmlContent,
      categoryId: formData.categoryId || null
    };

    try {
      if (isEditing) {
        await api.put(`/articles/${id}`, payload);
      } else {
        await api.post('/articles', payload);
      }
      navigate('/admin/articles');
    } catch (error) {
      console.error('Failed to save article', error);
      alert(error.response?.data?.message || 'Failed to save article. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link to="/admin/articles" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <FiArrowLeft className="text-[20px]" />
          </Link>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{isEditing ? 'Editing Publication' : 'New Publication'}</p>
            <p className="font-bold text-gray-900">{formData.title || 'Untitled'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex text-[12px] text-gray-500 items-center gap-1 font-bold">
            <span className={formData.published ? 'text-[#137333]' : 'text-orange-500'}>●</span>
            {formData.published ? 'Live' : 'Draft'}
          </span>
          <button 
            type="button" 
            onClick={() => setShowSettings(!showSettings)}
            className="md:hidden px-4 py-2 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Settings
          </button>
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-[#0052cc] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#0040a3] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
          >
            {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Publish')}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-12 relative">
        <div className={`md:col-span-8 lg:col-span-9 max-w-4xl w-full mx-auto ${showSettings ? 'hidden md:block' : 'block'}`}>
          <div className="mb-8">
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-transparent border-none focus:ring-0 px-0 py-2 text-[48px] md:text-[64px] font-display-xl font-bold text-gray-900 placeholder-gray-300 leading-tight"
              placeholder="Article Title"
              required
            />
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[60vh] relative">
            <MenuBar editor={editor} />
            <ImageMenu editor={editor} />
            <div className="px-8 md:px-12 pb-12">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className={`md:col-span-4 lg:col-span-3 space-y-6 ${showSettings ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24 space-y-6">
            
            {/* Publishing Settings */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-display-xl text-[20px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiSliders className="text-[20px] text-gray-400" />
                <span className="font-bold text-[13px] text-gray-900 uppercase tracking-widest">General</span>
              </h3>
              
              <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                <div>
                  <p className="font-bold text-[14px] text-gray-900">{formData.published ? 'Published' : 'Draft'}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Visibility status</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`block w-12 h-6 rounded-full transition-colors ${formData.published ? 'bg-[#137333]' : 'bg-gray-200'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.published ? 'transform translate-x-6 shadow-sm' : 'shadow-sm'}`}></div>
                </div>
              </label>
            </div>

            {/* Meta Information */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h3 className="font-display-xl text-[20px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiInfo className="text-[20px] text-gray-400" />
                <span className="font-bold text-[13px] text-gray-900 uppercase tracking-widest">Metadata</span>
              </h3>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2" htmlFor="categoryId">Sector / Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:ring-0 transition-all text-[14px] rounded-xl cursor-pointer outline-none"
                >
                  <option value="">-- Select Sector --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2" htmlFor="excerpt">Excerpt</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:ring-0 transition-all text-[13.5px] rounded-xl h-24 resize-none outline-none"
                  placeholder="Summary for SEO and cards..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2" htmlFor="expertTip">Expert Tip</label>
                <textarea
                  id="expertTip"
                  name="expertTip"
                  value={formData.expertTip}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:ring-0 transition-all text-[13.5px] rounded-xl h-24 resize-none outline-none"
                  placeholder="Enter a brief expert tip..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Tags</label>
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-[#0052cc] focus-within:bg-white transition-all">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-[12px] font-bold text-gray-700 shadow-sm">
                      {tag}
                      <button type="button" onClick={() => handleTagRemove(tag)} className="hover:text-red-500 text-[14px] flex items-center justify-center"><FiX /></button>
                    </span>
                  ))}
                  <input
                    type="text"
                    onKeyDown={handleTagAdd}
                    placeholder="Add tag and press Enter..."
                    className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-1 text-[13.5px] min-w-[120px] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-display-xl text-[20px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiImage className="text-[20px] text-gray-400" />
                <span className="font-bold text-[13px] text-gray-900 uppercase tracking-widest">Media</span>
              </h3>
              
              <div>
                <input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:ring-0 transition-all text-[13.5px] rounded-xl mb-4 outline-none"
                  placeholder="Paste image URL here"
                />
                
                {formData.coverImage ? (
                  <div className="w-full rounded-xl overflow-hidden border border-gray-200 aspect-video relative group">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button type="button" onClick={() => setFormData(prev => ({...prev, coverImage: ''}))} className="text-white font-bold text-[13px] hover:underline bg-black/50 px-4 py-2 rounded-lg">Remove Image</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-xl border-2 border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-[#0052cc]/50 transition-colors cursor-pointer group"
                  >
                    {isUploading ? (
                      <div className="w-8 h-8 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mb-2"></div>
                    ) : (
                      <>
                        <FiCamera className="text-[28px] mb-2 group-hover:text-[#0052cc] transition-colors" />
                        <span className="font-bold text-[13px] text-gray-700">Upload Cover Image</span>
                        <span className="text-[11px] text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</span>
                      </>
                    )}
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* PDF Report Upload */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-display-xl text-[20px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-[20px] text-gray-400" />
                <span className="font-bold text-[13px] text-gray-900 uppercase tracking-widest">Report (PDF)</span>
              </h3>
              
              <div>
                {formData.pdfReportUrl ? (
                  <div className="w-full rounded-xl border border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[13px] text-gray-900 truncate">Uploaded Report</p>
                        <p className="text-[11px] text-gray-500">{formData.pdfReportSize || 'PDF Document'}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({...prev, pdfReportUrl: '', pdfReportSize: ''}))} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Remove PDF"
                    >
                      <FiX className="text-[18px]" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => pdfInputRef.current?.click()}
                    className="w-full py-6 rounded-xl border-2 border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-[#0052cc]/50 transition-colors cursor-pointer group"
                  >
                    {isUploading ? (
                      <div className="w-6 h-6 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mb-2"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[28px] mb-2 group-hover:text-[#0052cc] transition-colors">upload_file</span>
                        <span className="font-bold text-[13px] text-gray-700">Upload PDF Report</span>
                        <span className="text-[11px] text-gray-400 mt-1">PDF up to 10MB</span>
                      </>
                    )}
                  </div>
                )}
                <input 
                  type="file" 
                  ref={pdfInputRef} 
                  onChange={handlePdfUpload} 
                  accept="application/pdf" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Guest/Custom Author Settings */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-display-xl text-[20px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiInfo className="text-[20px] text-gray-400" />
                <span className="font-bold text-[13px] text-gray-900 uppercase tracking-widest">Guest Author</span>
              </h3>
              
              <p className="text-[12px] text-gray-500 mb-2">Leave blank to use your own profile details.</p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2" htmlFor="customAuthorName">Author Name</label>
                <input
                  id="customAuthorName"
                  name="customAuthorName"
                  type="text"
                  value={formData.customAuthorName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:ring-0 transition-all text-[13.5px] rounded-xl outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2" htmlFor="customAuthorBio">Author Bio</label>
                <textarea
                  id="customAuthorBio"
                  name="customAuthorBio"
                  value={formData.customAuthorBio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:ring-0 transition-all text-[13.5px] rounded-xl h-24 resize-none outline-none"
                  placeholder="Guest author bio..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Author Avatar</label>
                <input
                  type="file"
                  ref={authorAvatarInputRef}
                  onChange={handleAuthorAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                {formData.customAuthorAvatar ? (
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-16 h-16">
                    <img src={formData.customAuthorAvatar} alt="Author Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => authorAvatarInputRef.current?.click()} className="text-white hover:text-[#0052cc]"><FiUpload /></button>
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, customAuthorAvatar: '' }))} className="text-white hover:text-red-500"><FiX /></button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => authorAvatarInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#0052cc] hover:text-[#0052cc] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <FiUpload className="text-[20px]" />
                    <span className="text-[13px] font-bold">Upload Avatar</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </form>
  );
};

export default ArticleEditor;
