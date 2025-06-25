import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import { Type, Image, Video, Lightbulb, Quote, Star, ChevronDown, FileText, Eye, Save, Layers, Upload, Copy, Trash2, X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette, Landmark, LinkIcon } from "lucide-react";
const componentLibrary = [
    {
        id: "heading", name: "Heading", icon: Type, color: "bg-blue-600",
        defaultProps: {
            content: "Placeholder Heading",
            fontSize: 32,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            color: "#1f2937",
            backgroundColor: "transparent",
            textAlign: "left",
        },
    },
    {
        id: "text", name: "Text Block", icon: Type, color: "bg-blue-400",
        defaultProps: {
            content: "This is a placeholder text block. You can edit this content.",
            fontSize: 16,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            color: "#374151",
            backgroundColor: "transparent",
            textAlign: "left",
            lineHeight: 1.6,
        },
    },
    {
        id: "image", name: "Image", icon: Image, color: "bg-green-500",
        defaultProps: {
            src: "", alt: "Placeholder image", caption: "Placeholder caption",
        },
    },
    {
        id: "video", name: "Video", icon: Video, color: "bg-red-500",
        defaultProps: { title: "Placeholder Video Title", url: "" },
    },
    {
        id: "accordion",
        name: "Accordion",
        icon: ChevronDown,
        color: "bg-indigo-500",
        defaultProps: {
            items: [
                {
                    id: 1,
                    title: "Section 1",
                    content: "Content for section 1.",
                    isOpen: false,
                    titleStyles: {
                        fontSize: 16,
                        fontWeight: "bold",
                        fontStyle: "normal",
                        textDecoration: "none",
                        color: "#1f2937",
                    },
                    contentStyles: {
                        fontSize: 14,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        textDecoration: "none",
                        color: "#374151",
                        lineHeight: 1.6,
                    },
                },
            ],
        },
    },
];
const BuilderContext = React.createContext(null);
const useBuilderContext = () => {
    const context = useContext(BuilderContext);
    if (!context)
        throw new Error("useBuilderContext must be used within a BuilderProvider");
    return context;
};
const styleControlsConfig = [
    { type: 'toggle', property: 'fontWeight', value: 'bold', icon: Bold, title: 'Bold' },
    { type: 'toggle', property: 'fontStyle', value: 'italic', icon: Italic, title: 'Italic' },
    { type: 'toggle', property: 'textDecoration', value: 'underline', icon: Underline, title: 'Underline' },
    { type: 'divider' },
    {
        type: 'align', property: 'textAlign', options: [
            { value: 'left', icon: AlignLeft, title: 'Align Left' },
            { value: 'center', icon: AlignCenter, title: 'Align Center' },
            { value: 'right', icon: AlignRight, title: 'Align Right' },
            { value: 'justify', icon: AlignJustify, title: 'Align Justify' },
        ]
    },
    { type: 'divider' },
    { type: 'number', property: 'fontSize', icon: Landmark, title: 'Font Size', unit: 'px' },
    { type: 'color', property: 'color', icon: Palette, title: 'Font Color' },
    { type: 'color', property: 'backgroundColor', icon: Palette, title: 'Background Color' },
];
const StyleToolbar = () => {
    const { state, actions } = useBuilderContext();
    const { selectedComponentObject, editingComponent } = state;
    const isEditingAccordionField =
        selectedComponentObject?.type === 'accordion' &&
        editingComponent &&
        (editingComponent.includes('title') || editingComponent.includes('content'));
    if (
        !selectedComponentObject ||
        (!['heading', 'text'].includes(selectedComponentObject.type) && !isEditingAccordionField)
    ) {
        return null;
    }
    const getActiveStyles = () => {
        if (['heading', 'text'].includes(selectedComponentObject.type)) {
            return selectedComponentObject;
        }
        if (isEditingAccordionField) {
            // Ensure we correctly parse the item ID which might be a number
            const [, field, itemIdStr] = editingComponent.split('-');
            const itemId = parseInt(itemIdStr, 10);
            const item = selectedComponentObject.items.find(i => i.id === itemId);
            return item ? item[`${field}Styles`] : {};
        }
        return {};
    };
    const activeStyles = getActiveStyles();
    const handleUpdate = (property, value) => {
        if (['heading', 'text'].includes(selectedComponentObject.type)) {
            actions.updateComponent(selectedComponentObject.id, { [property]: value });
        } else if (isEditingAccordionField) {
            const [, field, itemIdStr] = editingComponent.split('-');
            const itemId = parseInt(itemIdStr, 10);
            const updatedItems = selectedComponentObject.items.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        [`${field}Styles`]: {
                            ...item[`${field}Styles`],
                            [property]: value,
                        },
                    };
                }
                return item;
            });
            actions.updateComponent(selectedComponentObject.id, { items: updatedItems });
        }
    };
    const handleToggle = (property, value) => {
        const currentValue = activeStyles[property];
        handleUpdate(property, currentValue === value ? 'normal' : value);
    };
    return (
        <div className="bg-gray-100 rounded-lg p-1.5 flex items-center gap-1 border border-gray-200">
            {styleControlsConfig.map((control, index) => {
                if (control.type === 'divider') {
                    return <div key={index} className="w-px h-6 bg-gray-300 mx-1"></div>;
                }
                if (control.type === 'toggle') {
                    const isActive = activeStyles[control.property] === control.value;
                    return (
                        <button
                            key={control.property}
                            title={control.title}
                            onClick={() => handleToggle(control.property, control.value)}
                            className={`p-1.5 rounded-md ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <control.icon size={16} />
                        </button>
                    );
                }
                if (control.type === 'align') {
                    return (
                        <div key={control.property} className="flex items-center gap-0.5">
                            {control.options.map(opt => (
                                <button
                                    key={opt.value}
                                    title={opt.title}
                                    onClick={() => handleUpdate(control.property, opt.value)}
                                    className={`p-1.5 rounded-md ${activeStyles[control.property] === opt.value ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    <opt.icon size={16} />
                                </button>
                            ))}
                        </div>
                    );
                }
                // THIS IS THE CORRECTED BLOCK
                if (control.type === 'number') {
                    return (
                        <div key={control.property} className="flex items-center gap-1 bg-white border border-gray-300 rounded-md px-2 py-1">
                            <control.icon size={16} className="text-gray-500" />
                            <input
                                type="number"
                                title={control.title}
                                // We now correctly use activeStyles here
                                value={parseInt(activeStyles[control.property]) || ''}
                                onChange={(e) => handleUpdate(control.property, `${e.target.value}${control.unit || 'px'}`)}
                                className="w-12 text-sm focus:outline-none bg-transparent"
                            />
                        </div>
                    );
                }
                if (control.type === 'color') {
                    return (
                        <div key={control.property} title={control.title} className="relative w-8 h-8 flex items-center justify-center">
                            <control.icon size={16} className="text-gray-600 pointer-events-none" />
                            <input
                                type="color"
                                value={activeStyles[control.property]}
                                onChange={(e) => handleUpdate(control.property, e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: activeStyles[control.property] }}></div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};
const Header = ({ previewMode, onTogglePreview, onSave, onLoad }) => {
    const loadInputRef = useRef(null);
    return (
        <header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center shadow-sm z-20 flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                📖<span className="hidden sm:inline">Canvas Builder</span>
            </h1>
            <StyleToolbar />
            <div className="flex gap-3">
                <input type="file" ref={loadInputRef} accept="application/json" className="hidden" onChange={onLoad} />
                <button onClick={() => loadInputRef.current?.click()} className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm">
                    <Upload size={16} /> Load
                </button>
                <button onClick={onSave} className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors text-sm">
                    <Save size={16} /> Save
                </button>
                <button onClick={onTogglePreview} className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors text-sm ${previewMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <Eye size={16} />
                    {previewMode ? "Edit Mode" : "Preview"}
                </button>
            </div>
        </header>
    );
};
const Sidebar = ({ onDragStart }) => (
    <aside className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Layers size={20} /> Components
        </h2>
        <p className="text-xs text-gray-500 mb-4">
            Drag components onto the canvas.
        </p>
        <div className="grid grid-cols-2 gap-2">
            {componentLibrary.map((component) => (
                <SidebarItem key={component.id} component={component} onDragStart={onDragStart} />
            ))}
        </div>
    </aside>
);
const SidebarItem = ({ component, onDragStart }) => {
    const IconComponent = component.icon;
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, component.id)}
            className="p-3 bg-white rounded-lg cursor-grab shadow-sm border border-gray-200 text-center transition-all hover:shadow-md hover:-translate-y-0.5"
        >
            <div className={`w-9 h-9 mx-auto rounded-md flex items-center justify-center mb-2 ${component.color}`}>
                <IconComponent size={18} color="white" />
            </div>
            <p className="text-xs font-medium text-gray-700">{component.name}</p>
        </div>
    );
};
const Canvas = ({ children }) => {
    const { actions } = useBuilderContext();
    return (
        <main className="flex-1 overflow-auto relative bg-gray-100">
            <div
                ref={children}
                className="min-h-full w-full relative bg-white"
                style={{
                    backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
                onDrop={actions.handleCanvasDrop}
                onDragOver={actions.handleCanvasDragOver}
                onClick={actions.handleCanvasClick}
            >
                {actions.getComponents().length === 0 && <EmptyCanvasMessage />}
                {actions.getComponents().map((c) => (
                    <ComponentRenderer key={c.id} component={c} />
                ))}
            </div>
        </main>
    );
};
const EmptyCanvasMessage = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 p-8 pointer-events-none">
        <Layers size={56} className="mb-4 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-500 mb-2">
            Your Canvas is Empty
        </h3>
        <p className="max-w-md">
            Drag components from the sidebar to start building.
        </p>
    </div>
);
const Toast = ({ message, type, onDismiss }) => {
    if (!message) return null;
    const colors = { success: 'bg-green-500', error: 'bg-red-500' };
    return (
        <div className={`fixed bottom-5 right-5 ${colors[type]} text-white py-2 px-4 rounded-lg shadow-lg flex items-center z-50`}>
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-3 text-xl font-bold">&times;</button>
        </div>
    );
};
const EditableText = ({
    value, onChange, onBlur, onKeyDown, autoFocus, className,
    as: Component = "div", placeholder, isEditing, onStartEditing, style
}) => {
    const handleStartEditing = (e) => {
        e.stopPropagation();
        if (onStartEditing) onStartEditing(e);
    };
    if (isEditing) {
        const InputComponent = Component === "textarea" ? "textarea" : "input";
        return (
            <InputComponent
                type="text"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
                className={`${className} border-2 border-blue-500 rounded-md focus:outline-none w-full`}
                style={{
                    ...style
                }}
                onClick={(e) => e.stopPropagation()}
            />
        );
    }
    return (
        <Component className={`${className} cursor-move`} onClick={handleStartEditing} style={style}>
            {value || placeholder}
        </Component>
    );
};
const TextComponentRenderer = ({ component, isEditing, onUpdate, onStartEditing, as }) => (
    <div
        className="w-full h-full rounded-lg shadow-md overflow-hidden"
        style={{ backgroundColor: component.backgroundColor || '#FFFFFF' }}
    >
        <EditableText
            as={as}
            value={component.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onStartEditing={onStartEditing}
            isEditing={isEditing}
            placeholder={as === 'textarea' ? "Add your text content..." : "Placeholder Heading"}
            className={`w-full h-full p-4 bg-transparent ${as === 'textarea' ? 'resize-none' : 'flex items-center'}`}
            style={{
                fontSize: component.fontSize,
                fontWeight: component.fontWeight,
                fontStyle: component.fontStyle,
                textDecoration: component.textDecoration,
                color: component.color,
                textAlign: component.textAlign,
                lineHeight: component.lineHeight || 1.2,
            }}
        />
    </div>
);
const ImageComponent = ({ component, isEditing, onUpdate, onStartEditing }) => {
    const fileInputRef = useRef(null);
    const [aspectRatio, setAspectRatio] = useState(null);
    const [inputType, setInputType] = useState('upload');
    const [linkUrl, setLinkUrl] = useState('');

    const handleImageUpload = useCallback((file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => onUpdate({ src: e.target.result, sourceType: 'upload' });
            reader.readAsDataURL(file);
        }
    }, [onUpdate]);

    const handleAddLink = useCallback(() => {
        if (linkUrl && linkUrl.trim() !== '') {
            onUpdate({ src: linkUrl, sourceType: 'link' });
        }
    }, [linkUrl, onUpdate]);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        const ratio = naturalWidth / naturalHeight;
        setAspectRatio(ratio);
    };

    if (!component.src) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4">
                <div className="flex mb-4">
                    <button
                        onClick={() => setInputType('upload')}
                        className={`px-3 py-1 rounded-l-md text-sm font-semibold ${inputType === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <Upload size={16} className="inline-block mr-1" />
                        Upload
                    </button>
                    <button
                        onClick={() => setInputType('link')}
                        className={`px-3 py-1 rounded-r-md text-sm font-semibold ${inputType === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <LinkIcon size={16} className="inline-block mr-1" />
                        Link
                    </button>
                </div>

                <div className="w-full text-center" style={{ minHeight: '120px' }}>
                    {inputType === 'upload' ? (
                        <div key="upload-section">
                            <Upload size={32} className="text-gray-400 mb-2 mx-auto" />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-600"
                            >
                                Upload Image
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Select an image file from your computer.</p>
                        </div>
                    ) : (
                        <div key="link-section">
                            <LinkIcon size={32} className="text-gray-400 mb-2 mx-auto" />
                            <div className="flex w-full">
                                <input
                                    key="url-input"
                                    type="text"
                                    placeholder="Paste image URL here"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="flex-grow px-2 py-1 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleAddLink}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-r-md text-sm font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                                    disabled={!linkUrl.trim()}
                                >
                                    Add
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Paste an image link and click 'Add'.</p>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col bg-white rounded-lg overflow-hidden shadow">
            <div
                className="relative w-full group"
                style={{
                    aspectRatio: aspectRatio ? `${aspectRatio}` : '16/9',
                    width: '100%',
                    height: 'auto'
                }}
            >
                <img
                    src={component.src}
                    alt={component.alt}
                    className="w-full h-full object-cover"
                    onLoad={handleImageLoad}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity duration-200">
                    <button
                        onClick={() => onUpdate({ src: null, sourceType: null, caption: '' })}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Change
                    </button>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            />
            <div className="p-2 bg-white">
                <EditableText
                    value={component.caption}
                    onChange={(e) => onUpdate({ caption: e.target.value })}
                    onStartEditing={(e) => onStartEditing(e, "caption")}
                    isEditing={isEditing}
                    placeholder="Image caption"
                    className="text-xs text-gray-600 italic text-center w-full"
                />
            </div>
        </div>
    );
};
const VideoComponent = ({ component, isEditing, onUpdate, onStartEditing }) => {
    const fileInputRef = useRef(null);
    const [inputType, setInputType] = useState('upload');
    const [linkUrl, setLinkUrl] = useState('');

    const handleVideoUpload = useCallback((file) => {
        if (file && file.type.startsWith("video/")) {
            const reader = new FileReader();
            reader.onload = (e) => onUpdate({ src: e.target.result, sourceType: 'upload' });
            reader.readAsDataURL(file);
        }
    }, [onUpdate]);

    const handleAddLink = useCallback(() => {
        if (linkUrl && linkUrl.trim() !== '') {
            onUpdate({ src: linkUrl, sourceType: 'link' });
        }
    }, [linkUrl, onUpdate]);

    const getEmbedUrl = (url) => {
        if (!url) return '';

        let videoId;

        let match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        if (match && match[2].length === 11) {
            videoId = match[2];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        match = url.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
        if (match && match[3]) {
            videoId = match[3];
            return `https://player.vimeo.com/video/${videoId}`;
        }

        return url;
    };

    if (!component.src) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4">
                <div className="flex mb-4">
                    <button
                        onClick={() => setInputType('upload')}
                        className={`px-3 py-1 rounded-l-md text-sm font-semibold ${inputType === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <Upload size={16} className="inline-block mr-1" />
                        Upload
                    </button>
                    <button
                        onClick={() => setInputType('link')}
                        className={`px-3 py-1 rounded-r-md text-sm font-semibold ${inputType === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        <LinkIcon size={16} className="inline-block mr-1" />
                        Link
                    </button>
                </div>

                <div className="w-full text-center" style={{ minHeight: '120px' }}>
                    {inputType === 'upload' ? (
                        <div key="upload-section">
                            <Upload size={32} className="text-gray-400 mb-2 mx-auto" />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-600"
                            >
                                Upload Video
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Select a video file from your computer.</p>
                        </div>
                    ) : (
                        <div key="link-section">
                            <LinkIcon size={32} className="text-gray-400 mb-2 mx-auto" />
                            <div className="flex w-full">
                                <input
                                    key="url-input"
                                    type="text"
                                    placeholder="Paste YouTube or Vimeo URL here"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="flex-grow px-2 py-1 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleAddLink}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-r-md text-sm font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                                    disabled={!linkUrl.trim()}
                                >
                                    Add
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Paste a link and click 'Add'.</p>
                        </div>
                    )}
                </div>

                <input
                    type="file" 
                    ref={fileInputRef} 
                    accept="video/*" 
                    className="hidden"
                    onChange={(e) => e.target.files && handleVideoUpload(e.target.files[0])}
                />
            </div>
        );
    }

    const embedUrl = getEmbedUrl(component.src);

    return (
        <div className="w-full flex flex-col bg-white rounded-lg overflow-hidden shadow">
            <div
                className="relative w-full group bg-black"
                style={{ aspectRatio: '16/9', width: '100%', height: 'auto' }}
            >
                {component.sourceType === 'upload' ? (
                    <video
                        key={component.src}
                        src={component.src}
                        controls
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <iframe
                        key={component.src}
                        src={embedUrl}
                        title={component.caption || 'Embedded Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                )}

                <div className="absolute top-2 right-2">
                    <button
                        onClick={() => onUpdate({ src: null, sourceType: null, caption: '' })}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Change
                    </button>
                </div>
            </div>

            <div className="p-2 bg-white">
                <EditableText
                    value={component.caption}
                    onChange={(e) => onUpdate({ caption: e.target.value })}
                    onStartEditing={(e) => onStartEditing(e, "caption")}
                    isEditing={isEditing}
                    placeholder="Video caption"
                    className="text-xs text-gray-600 italic text-center w-full"
                />
            </div>
        </div>
    );
};
const AccordionComponent = ({ component, onUpdate, onStartEditing, editingComponent }) => {
    const toggleItem = (itemId) => {
        onUpdate({ items: component.items.map(i => (i.id === itemId ? { ...i, isOpen: !i.isOpen } : i)) });
    };
    const updateItem = (itemId, field, value) => {
        onUpdate({
            items: component.items.map(i => (i.id === itemId ? { ...i, [field]: value } : i)),
        });
    };
    const addItem = () => {
        const newItem = {
            id: Date.now(),
            title: "New Section",
            content: "Add content",
            isOpen: false,
            titleStyles: { fontSize: 16, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', color: '#1f2937' },
            contentStyles: { fontSize: 14, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', color: '#374151', lineHeight: 1.6 },
        };
        onUpdate({ items: [...component.items, newItem] });
    };
    const removeItem = (itemId) => {
        if (component.items.length > 1) {
            onUpdate({ items: component.items.filter(item => item.id !== itemId) });
        }
    };
    return (
        <div className="w-full h-full bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-3 space-y-1 flex-1 overflow-y-auto">
                {component.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleItem(item.id)}
                            style={item.titleStyles}
                        >
                            <EditableText
                                value={item.title}
                                onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                                onStartEditing={(e) => {
                                    e.stopPropagation();
                                    onStartEditing(e, `title-${item.id}`);
                                }}
                                isEditing={editingComponent === `${component.id}-title-${item.id}`}
                                className="flex-1 font-medium text-gray-800 text-sm"
                                style={item.titleStyles}
                            />
                            <div className="flex items-center gap-1">
                                {component.items.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                        title="Remove"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform ${item.isOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>
                        </div>
                        {item.isOpen && (
                            <div
                                className="p-3 bg-white border-t border-gray-200"
                                style={item.contentStyles}
                            >
                                <EditableText
                                    as="textarea"
                                    value={item.content}
                                    onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                                    onStartEditing={(e) => onStartEditing(e, `content-${item.id}`)}
                                    isEditing={
                                        editingComponent === `${component.id}-content-${item.id}`
                                    }
                                    className="w-full text-sm text-gray-600 resize-none bg-transparent min-h-[60px]"
                                    style={item.contentStyles}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={addItem}
                    className="w-full py-2 px-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                >
                    + Add Section
                </button>
            </div>
        </div>
    );
};
const ComponentWrapper = ({ component, children }) => {
    const { actions, state } = useBuilderContext();
    const { selectedComponent, isResizing, previewMode } = state;
    const isSelected = selectedComponent === component.id;

    const resizeHandles = [
        { pos: "top-0 left-0 -translate-x-1/2 -translate-y-1/2", cursor: "cursor-nwse-resize", id: "nw" },
        { pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2", cursor: "cursor-ns-resize", id: "n" },
        { pos: "top-0 right-0 translate-x-1/2 -translate-y-1/2", cursor: "cursor-nesw-resize", id: "ne" },
        { pos: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2", cursor: "cursor-ew-resize", id: "w" },
        { pos: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2", cursor: "cursor-ew-resize", id: "e" },
        { pos: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2", cursor: "cursor-nesw-resize", id: "sw" },
        { pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2", cursor: "cursor-ns-resize", id: "s" },
        { pos: "bottom-0 right-0 translate-x-1/2 translate-y-1/2", cursor: "cursor-nwse-resize", id: "se" },
    ];

    const ActionToolbar = ({ componentId }) => (
        <div className="absolute -top-10 left-0 bg-gray-800 text-white rounded-lg shadow-lg flex items-center p-1 z-10" onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); actions.duplicateComponent(componentId) }} className="p-1.5 hover:bg-gray-700 rounded" title="Duplicate"><Copy size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); actions.deleteComponent(componentId) }} className="p-1.5 hover:bg-red-500 rounded" title="Delete"><Trash2 size={14} /></button>
        </div>
    );

    // Check if the target is a form element that should handle its own events
    const isFormElement = (target) => {
        const formElements = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];
        return formElements.includes(target.tagName) || 
               target.closest('input') || 
               target.closest('textarea') || 
               target.closest('button') ||
               target.hasAttribute('contenteditable');
    };

    const handleMouseDown = (e) => {
        // Don't interfere with form elements
        if (isFormElement(e.target)) {
            return;
        }
        
        if (!isResizing && !previewMode) {
            actions.handleComponentMouseDown(e, component.id);
        }
    };

    const handleClick = (e) => {
        // Don't interfere with form elements
        if (isFormElement(e.target)) {
            return;
        }
        
        e.stopPropagation();
        actions.setSelectedComponent(component.id);
    };

    return (
        <div
            style={{
                left: component.x, top: component.y,
                width: component.width, height: component.height,
                zIndex: isSelected ? 100 : component.zIndex,
                cursor: !isResizing && !previewMode ? "move" : "default",
            }}
            className={`absolute group ${isSelected && !previewMode ? "outline-2 outline-blue-500 outline-dashed" : ""}`}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <div className="relative w-full h-full">{children}</div>
            {isSelected && !previewMode && <ActionToolbar componentId={component.id} />}
            {isSelected && !previewMode && (
                <>
                    {resizeHandles.map(({ pos, cursor, id }) => (
                        <div
                            key={id}
                            className={`absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full z-20 ${cursor} ${pos}`}
                            onMouseDown={(e) => { e.stopPropagation(); actions.handleResizeStart(e, component.id, id); }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};
const ComponentRenderer = ({ component }) => {
    const { state, actions } = useBuilderContext();
    const { editingComponent } = state;
    const isEditing = editingComponent && editingComponent.startsWith(component.id);
    const props = {
        component, isEditing,
        onUpdate: (updates) => actions.updateComponent(component.id, updates),
        onStartEditing: (e, field = "main") => actions.setEditingComponent(field === "main" ? component.id : `${component.id}-${field}`),
    };
    const renderContent = () => {
        switch (component.type) {
            case "heading": return <TextComponentRenderer {...props} as="div" />;
            case "text": return <div className="bg-transparent w-full h-full"><TextComponentRenderer {...props} as="textarea" /></div>;
            case "image": return <ImageComponent {...props} isEditing={editingComponent === `${component.id}-caption`} />;
            case "video": return <VideoComponent {...props} isEditing={editingComponent === `${component.id}-caption`} />;
            case "accordion": return <AccordionComponent {...props} editingComponent={editingComponent} />;
            default: return <div className="p-4 bg-gray-200 rounded-lg flex items-center justify-center h-full"><p className="text-sm text-gray-600">Component: {component.type}</p></div>;
        }
    };
    return <ComponentWrapper component={component}>{renderContent()}</ComponentWrapper>;
};
const InteractiveMagazineBuilder = () => {
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [editingComponent, setEditingComponent] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [draggedComponentType, setDraggedComponentType] = useState(null);
    const [actionState, setActionState] = useState({ isDragging: false, isResizing: false });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState(null);
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const canvasRef = useRef(null);
    const selectedComponentObject = components.find(c => c.id === selectedComponent) || null;
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type }), 3000);
    };
    const generateId = () => Math.random().toString(36).substr(2, 9);
    const createComponent = (type, x, y) => {
        const template = componentLibrary.find((comp) => comp.id === type);
        if (!template) return null;
        const defaultSizes = {
            heading: { w: 400, h: 60 }, text: { w: 320, h: 100 }, image: { w: 350, h: 250 },
            video: { w: 350, h: 250 }, accordion: { w: 400, h: 200 },
        };
        const size = defaultSizes[type] || { w: 320, h: 100 };
        return {
            id: generateId(), type, x, y,
            width: size.w, height: size.h, zIndex: components.length + 1,
            ...JSON.parse(JSON.stringify(template.defaultProps)),
        };
    };
    const updateComponent = useCallback((id, updates) => {
        setComponents((cs) => cs.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }, []);
    const deleteComponent = useCallback((id) => {
        setComponents((cs) => cs.filter((c) => c.id !== id));
        if (selectedComponent === id) setSelectedComponent(null);
    }, [selectedComponent]);
    const duplicateComponent = useCallback((id) => {
        const compToDup = components.find((c) => c.id === id);
        if (compToDup) {
            const newComp = {
                ...JSON.parse(JSON.stringify(compToDup)),
                id: generateId(),
                x: compToDup.x + 20, y: compToDup.y + 20,
                zIndex: components.length + 1,
            };
            setComponents((cs) => [...cs, newComp]);
            setSelectedComponent(newComp.id);
        }
    }, [components]);
    const handleCanvasDrop = (e) => {
        e.preventDefault();
        if (!draggedComponentType || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newComponent = createComponent(draggedComponentType, x, y);
        if (newComponent) {
            setComponents((cs) => [...cs, newComponent]);
            setSelectedComponent(newComponent.id);
        }
        setDraggedComponentType(null);
    };
    const handleComponentMouseDown = (e, componentId) => {
        if (previewMode || (editingComponent && editingComponent.startsWith(componentId)) || actionState.isResizing) return;
        e.preventDefault(); e.stopPropagation();
        const component = components.find((c) => c.id === componentId);
        if (!component || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        setSelectedComponent(componentId);
        setActionState({ isDragging: true, isResizing: false });
        if (editingComponent) setEditingComponent(null);
        setDragOffset({ x: e.clientX - rect.left - component.x, y: e.clientY - rect.top - component.y });
    };
    const handleResizeStart = (e, componentId, handle) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedComponent(componentId);
        setActionState({ isDragging: false, isResizing: true });
        setResizeHandle(handle);
    };
    const handleMouseMove = useCallback((e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if (actionState.isDragging && selectedComponent) {
            updateComponent(selectedComponent, { x: Math.max(0, mouseX - dragOffset.x), y: Math.max(0, mouseY - dragOffset.y) });
        } else if (actionState.isResizing && selectedComponent) {
            const component = components.find((c) => c.id === selectedComponent);
            if (!component) return;
            let { x, y, width, height } = component;
            const minWidth = 50, minHeight = 50;
            if (resizeHandle.includes("e")) width = Math.max(minWidth, mouseX - x);
            if (resizeHandle.includes("s")) height = Math.max(minHeight, mouseY - y);
            if (resizeHandle.includes("w")) {
                const newWidth = x + width - mouseX;
                if (newWidth > minWidth) { width = newWidth; x = mouseX; }
            }
            if (resizeHandle.includes("n")) {
                const newHeight = y + height - mouseY;
                if (newHeight > minHeight) { height = newHeight; y = mouseY; }
            }
            updateComponent(selectedComponent, { x, y, width, height });
        }
    }, [actionState, selectedComponent, components, dragOffset, resizeHandle, updateComponent]);
    const handleMouseUp = useCallback(() => setActionState({ isDragging: false, isResizing: false }), []);
    const handleCanvasClick = (e) => {
        if (e.target === canvasRef.current) {
            setSelectedComponent(null);
            setEditingComponent(null);
        }
    };
    const handleSetEditing = useCallback((id) => {
        setEditingComponent(id);
        if (id) setSelectedComponent(id.split("-")[0]);
    }, []);
    useEffect(() => {
        if (actionState.isDragging || actionState.isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [actionState, handleMouseMove, handleMouseUp]);
    const handleSave = () => {
        const jsonString = JSON.stringify(components, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "canvas-data.json";
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
        showToast('Canvas saved successfully!');
    };
    const handleLoad = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    setComponents(JSON.parse(event.target.result));
                    setSelectedComponent(null);
                    setEditingComponent(null);
                    showToast('Canvas loaded successfully!');
                } catch (error) {
                    showToast('Failed to load file. Invalid JSON format.', 'error');
                }
            };
            reader.readAsText(file);
        } else {
            showToast('Please select a valid JSON file.', 'error');
        }
        e.target.value = null;
    };
    const contextValue = {
        state: { components, selectedComponent, selectedComponentObject, editingComponent, previewMode, isResizing: actionState.isResizing },
        actions: {
            updateComponent, setEditingComponent: handleSetEditing, setSelectedComponent, deleteComponent, duplicateComponent,
            handleResizeStart, handleComponentMouseDown, getComponents: () => components, handleCanvasDrop,
            handleCanvasDragOver: (e) => e.preventDefault(), handleCanvasClick
        },
    };
    return (
        <BuilderContext.Provider value={contextValue}>
            <div className="h-screen w-screen flex flex-col font-sans bg-gray-100">
                <Header
                    previewMode={previewMode}
                    onTogglePreview={() => setPreviewMode(!previewMode)}
                    onSave={handleSave}
                    onLoad={handleLoad}
                />
                <div className="flex-1 flex overflow-hidden">
                    {!previewMode && <Sidebar onDragStart={(e, type) => setDraggedComponentType(type)} />}
                    <Canvas>
                        {(node) => { canvasRef.current = node; }}
                    </Canvas>
                </div>
                <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ message: '' })} />
            </div>
        </BuilderContext.Provider>
    );
};
export default InteractiveMagazineBuilder;
