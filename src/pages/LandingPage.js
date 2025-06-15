import React, { useState, useRef, useCallback, useEffect, useContext, } from "react";
import { Type, Image, Video, Lightbulb, Quote, Star, ChevronDown, FileText, Eye, Save, Layers, Upload, Copy, Trash2, } from "lucide-react";
const clsx = (...classes) => classes.filter(Boolean).join(" ");
const componentLibrary = [
    {
        id: "heading",
        name: "Heading",
        icon: Type,
        color: "bg-blue-600",
        defaultProps: {
            content: "Your Heading Here",
            fontSize: 32,
            fontWeight: "bold",
            color: "#1f2937",
            textAlign: "left",
        },
    },
    {
        id: "text",
        name: "Text Block",
        icon: Type,
        color: "bg-blue-400",
        defaultProps: {
            content: "Add your text content here. Click to edit this text.",
            fontSize: 16,
            color: "#374151",
            lineHeight: 1.6,
        },
    },
    {
        id: "image",
        name: "Image",
        icon: Image,
        color: "bg-green-500",
        defaultProps: {
            src: "",
            alt: "Educational image",
            caption: "Click to add image caption",
        },
    },
    {
        id: "video",
        name: "Video",
        icon: Video,
        color: "bg-red-500",
        defaultProps: { title: "Click to add video title", url: "" },
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
                    title: "First Section",
                    content: "Content for first section",
                    isOpen: false,
                },
                {
                    id: 2,
                    title: "Second Section",
                    content: "Content for second section",
                    isOpen: false,
                },
            ],
        },
    },
    {
        id: "tabs",
        name: "Tabs",
        icon: FileText,
        color: "bg-cyan-500",
        defaultProps: {
            activeTab: 0,
            tabs: [
                { id: 1, title: "Tab 1", content: "Content for first tab" },
                { id: 2, title: "Tab 2", content: "Content for second tab" },
            ],
        },
    },
    {
        id: "table",
        name: "Table",
        icon: FileText,
        color: "bg-gray-600",
        defaultProps: {
            headers: ["Header 1", "Header 2"],
            rows: [
                ["Row 1 Col 1", "Row 1 Col 2"],
                ["Row 2 Col 1", "Row 2 Col 2"],
            ],
        },
    },
    {
        id: "didyouknow",
        name: "Did You Know",
        icon: Lightbulb,
        color: "bg-yellow-500",
        defaultProps: {
            title: "Did You Know?",
            content: "Click to add an interesting fact!",
        },
    },
    {
        id: "highlight",
        name: "Highlight Box",
        icon: Star,
        color: "bg-pink-500",
        defaultProps: {
            content: "Click to add important information",
            variant: "info",
        },
    },
    {
        id: "quote",
        name: "Quote",
        icon: Quote,
        color: "bg-purple-500",
        defaultProps: {
            text: "Click to add an inspiring quote",
            author: "Author Name",
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
const Header = ({ previewMode, onTogglePreview, onSave }) => (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📖<span className="hidden sm:inline">InstructoHub Magazine Builder</span>
        </h1>
        <div className="flex gap-3">
            <button
                onClick={onTogglePreview}
                className={clsx(
                    "px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors text-sm",
                    previewMode
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
            >
                <Eye size={16} />
                {previewMode ? "Edit Mode" : "Preview"}
            </button>
            <button
                onClick={onSave}
                className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors text-sm"
            >
                <Save size={16} />
                Save
            </button>
        </div>
    </header>
);
const Sidebar = ({ onDragStart }) => (
    <aside className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Layers size={20} />
            Components
        </h2>
        <p className="text-xs text-gray-500 mb-4">
            Drag components onto the canvas.
        </p>
        <div className="grid grid-cols-2 gap-2">
            {componentLibrary.map((component) => (
                <SidebarItem
                    key={component.id}
                    component={component}
                    onDragStart={onDragStart}
                />
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
            <div
                className={clsx(
                    "w-9 h-9 mx-auto rounded-md flex items-center justify-center mb-2",
                    component.color
                )}
            >
                <IconComponent size={18} color="white" />
            </div>
            <p className="text-xs font-medium text-gray-700">{component.name}</p>
        </div>
    );
};
const Canvas = ({ components, onDrop, onDragOver, onClick, children }) => (
    <main className="flex-1 overflow-auto relative bg-gray-100">
        <div
            ref={children}
            className="min-h-full w-full relative bg-white"
            style={{
                backgroundImage:
                    "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "20px 20px",
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={onClick}
        >
            {components.length === 0 && <EmptyCanvasMessage />}
            {components.map((c) => (
                <ComponentRenderer key={c.id} component={c} />
            ))}
        </div>
    </main>
);
const EmptyCanvasMessage = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 p-8 pointer-events-none">
        <Layers size={56} className="mb-4 opacity-50" />
        <h3 className="text-2xl font-semibold text-gray-500 mb-2">
            Create Your Magazine Page
        </h3>
        <p className="max-w-md">
            Drag components from the sidebar and position them anywhere.
        </p>
    </div>
);
const EditableText = ({
    value,
    onChange,
    onBlur,
    onKeyDown,
    autoFocus,
    className,
    as: Component = "div",
    placeholder,
    isEditing,
    onStartEditing,
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
                className={clsx(
                    className,
                    "bg-white border-2 border-blue-500 rounded-md focus:outline-none w-full"
                )}
                onClick={(e) => e.stopPropagation()}
            />
        );
    }
    
    return (
        <Component
            className={clsx(className, "cursor-pointer")}
            onClick={handleStartEditing}
        >
            {value || placeholder}
        </Component>
    );
};
const HeadingComponent = ({
    component,
    isEditing,
    onUpdate,
    onStartEditing,
}) => (
    <EditableText
        value={component.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onStartEditing={onStartEditing}
        isEditing={isEditing}
        placeholder="Your Heading Here"
        className="w-full h-full flex items-center p-1"
        style={{
            fontSize: `${component.fontSize}px`,
            fontWeight: component.fontWeight,
            color: component.color,
            textAlign: component.textAlign,
            lineHeight: 1.2,
        }}
    />
);
const TextBlockComponent = ({
    component,
    isEditing,
    onUpdate,
    onStartEditing,
}) => (
    <EditableText
        as="textarea"
        value={component.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onStartEditing={onStartEditing}
        isEditing={isEditing}
        placeholder="Add your text content here..."
        className="w-full h-full p-2 resize-none bg-transparent"
        style={{
            fontSize: `${component.fontSize}px`,
            color: component.color,
            lineHeight: component.lineHeight,
        }}
    />
);
const ImageComponent = ({ component, isEditing, onUpdate, onStartEditing }) => {
    const fileInputRef = useRef(null);
    const handleImageUpload = (file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => onUpdate({ src: e.target.result });
            reader.readAsDataURL(file);
        }
    };
    if (!component.src) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <Upload size={32} className="text-gray-400 mb-2" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-600"
                >
                    Upload Image
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                        e.target.files && handleImageUpload(e.target.files[0])
                    }
                />
            </div>
        );
    }
    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden shadow">
            <img
                src={component.src}
                alt={component.alt}
                className="w-full flex-1 object-cover"
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
const ActionToolbar = ({ componentId }) => {
    const { actions } = useBuilderContext();
    const handleActionClick = (e, action) => {
        e.stopPropagation();
        e.preventDefault();
        action();
    };
    return (
        <div
            className="absolute -top-10 left-0 bg-gray-800 text-white rounded-lg shadow-lg flex items-center p-1 z-10"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button
                onClick={(e) =>
                    handleActionClick(e, () => actions.duplicateComponent(componentId))
                }
                className="p-1.5 hover:bg-gray-700 rounded"
                title="Duplicate"
            >
                <Copy size={14} />
            </button>
            <button
                onClick={(e) =>
                    handleActionClick(e, () => actions.deleteComponent(componentId))
                }
                className="p-1.5 hover:bg-red-500 rounded"
                title="Delete"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};
const resizeHandles = [
    { pos: "top-0 left-0", cursor: "cursor-nwse-resize", id: "nw" },
    { pos: "top-0 left-1/2", cursor: "cursor-ns-resize", id: "n" },
    { pos: "top-0 right-0", cursor: "cursor-nesw-resize", id: "ne" },
    { pos: "left-0 top-1/2", cursor: "cursor-ew-resize", id: "w" },
    { pos: "right-0 top-1/2", cursor: "cursor-ew-resize", id: "e" },
    { pos: "bottom-0 left-0", cursor: "cursor-nesw-resize", id: "sw" },
    { pos: "bottom-0 left-1/2", cursor: "cursor-ns-resize", id: "s" },
    { pos: "bottom-0 right-0", cursor: "cursor-nwse-resize", id: "se" },
];
const ComponentWrapper = ({ component, children }) => {
    const { actions, state } = useBuilderContext();
    const { selectedComponent, isResizing, previewMode } = state;
    const isSelected = selectedComponent === component.id;
    return (
        <div
            style={{
                left: component.x,
                top: component.y,
                width: component.width,
                height: component.height,
                zIndex: isSelected ? 100 : component.zIndex,
                cursor: !isResizing && !previewMode ? "move" : "default",
            }}
            className={clsx(
                "absolute group",
                isSelected && "outline-2 outline-blue-500 outline-dashed"
            )}
            onMouseDown={(e) =>
                !isResizing && actions.handleComponentMouseDown(e, component.id)
            }
            onClick={(e) => {
                e.stopPropagation();
                actions.setSelectedComponent(component.id);
            }}
        >
            <div className="relative w-full h-full">{children}</div>
            {isSelected && !previewMode && (
                <ActionToolbar componentId={component.id} />
            )}
            {isSelected && !previewMode && (
                <>
                    {resizeHandles.map(({ pos, cursor, id }) => (
                        <div
                            key={id}
                            className={clsx(
                                "absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full z-20",
                                cursor
                            )}
                            style={{
                                transform: "translate(-50%, -50%)",
                                ...getHandleStyle(pos),
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                actions.handleResizeStart(e, component.id, id);
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};
const getHandleStyle = (pos) => {
    const style = {};
    if (pos.includes("top-0")) style.top = "0%";
    if (pos.includes("left-0")) style.left = "0%";
    if (pos.includes("right-0")) style.left = "100%";
    if (pos.includes("bottom-0")) style.top = "100%";
    if (pos.includes("left-1/2")) style.left = "50%";
    if (pos.includes("top-1/2")) style.top = "50%";
    return style;
};
const ComponentRenderer = ({ component }) => {
    const { state, actions } = useBuilderContext();
    const { editingComponent } = state;
    const isEditing =
        editingComponent && editingComponent.startsWith(component.id);
    const props = {
        component,
        isEditing: isEditing,
        onUpdate: (updates) => actions.updateComponent(component.id, updates),
        onStartEditing: (e, field = "main") =>
            actions.setEditingComponent(
                field === "main" ? component.id : `${component.id}-${field}`
            ),
    };
    const renderContent = () => {
        switch (component.type) {
            case "heading":
                return <HeadingComponent {...props} />;
            case "text":
                return (
                    <div className="bg-white rounded-lg shadow w-full h-full">
                        <TextBlockComponent {...props} />
                    </div>
                );
            case "image":
                return (
                    <ImageComponent
                        {...props}
                        isEditing={editingComponent === `${component.id}-caption`}
                    />
                );
            case "accordion":
                return (
                    <div className="bg-white rounded-lg shadow w-full h-full">
                        <AccordionComponent
                            {...props}
                            editingComponent={editingComponent}
                        />
                    </div>
                );
            default:
                return (
                    <div className="p-4 bg-gray-200 rounded-lg flex items-center justify-center h-full">
                        <p className="text-sm text-gray-600">Component: {component.type}</p>
                    </div>
                );
        }
    };
    return (
        <ComponentWrapper component={component}>{renderContent()}</ComponentWrapper>
    );
};
const AccordionComponent = ({ component, onUpdate, onStartEditing, editingComponent }) => {
    const toggleItem = (itemId) => {
        const updatedItems = component.items.map(item => 
            item.id === itemId ? { ...item, isOpen: !item.isOpen } : item
        );
        onUpdate({ items: updatedItems });
    };

    const updateItemTitle = (itemId, newTitle) => {
        const updatedItems = component.items.map(item => 
            item.id === itemId ? { ...item, title: newTitle } : item
        );
        onUpdate({ items: updatedItems });
    };

    const updateItemContent = (itemId, newContent) => {
        const updatedItems = component.items.map(item => 
            item.id === itemId ? { ...item, content: newContent } : item
        );
        onUpdate({ items: updatedItems });
    };

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            title: "New Section",
            content: "Add your content here",
            isOpen: false
        };
        onUpdate({ items: [...component.items, newItem] });
    };

    const removeItem = (itemId) => {
        if (component.items.length > 1) {
            const updatedItems = component.items.filter(item => item.id !== itemId);
            onUpdate({ items: updatedItems });
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow overflow-hidden">
            <div className="p-3 space-y-1">
                {component.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => toggleItem(item.id)}
                        >
                            <EditableText
                                value={item.title}
                                onChange={(e) => updateItemTitle(item.id, e.target.value)}
                                onStartEditing={(e) => {
                                    e.stopPropagation();
                                    onStartEditing(e, `title-${item.id}`);
                                }}
                                isEditing={editingComponent === `${component.id}-title-${item.id}`}
                                placeholder="Click to edit section title"
                                className="flex-1 font-medium text-gray-800 text-sm"
                            />
                            <div className="flex items-center gap-1">
                                {component.items.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove section"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <ChevronDown 
                                    size={16} 
                                    className={clsx(
                                        "text-gray-400 transition-transform duration-200",
                                        item.isOpen && "rotate-180"
                                    )}
                                />
                            </div>
                        </div>
                        {item.isOpen && (
                            <div className="p-3 bg-white border-t border-gray-200">
                                <EditableText
                                    as="textarea"
                                    value={item.content}
                                    onChange={(e) => updateItemContent(item.id, e.target.value)}
                                    onStartEditing={(e) => onStartEditing(e, `content-${item.id}`)}
                                    isEditing={editingComponent === `${component.id}-content-${item.id}`}
                                    placeholder="Click to add content for this section"
                                    className="w-full text-sm text-gray-600 resize-none bg-transparent min-h-[60px]"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={addItem}
                    className="w-full py-2 px-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center gap-1"
                >
                    + Add Section
                </button>
            </div>
        </div>
    );
};
const InteractiveMagazineBuilder = () => {
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [editingComponent, setEditingComponent] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [draggedComponentType, setDraggedComponentType] = useState(null);
    const [actionState, setActionState] = useState({
        isDragging: false,
        isResizing: false,
    });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState(null);
    const canvasRef = useRef(null);
    const generateId = () => Math.random().toString(36).substr(2, 9);
    const createComponent = (type, x, y) => {
        const template = componentLibrary.find((comp) => comp.id === type);
        if (!template) return null;
        const widthMap = {
            heading: 400,
            text: 320,
            image: 350,
            video: 350,
            accordion: 400,
            tabs: 450,
            table: 500,
            didyouknow: 320,
            highlight: 320,
            quote: 350,
        };
        const heightMap = {
            heading: 50,
            text: 100,
            image: 250,
            video: 250,
            accordion: 200,
            tabs: 250,
            table: 200,
            didyouknow: 80,
            highlight: 60,
            quote: 100,
        };
        return {
            id: generateId(),
            type,
            x,
            y,
            width: widthMap[type] || 320,
            height: heightMap[type] || 100,
            zIndex: components.length + 1,
            ...JSON.parse(JSON.stringify(template.defaultProps)),
        };
    };
    const updateComponent = useCallback(
        (id, updates) =>
            setComponents((cs) =>
                cs.map((c) => (c.id === id ? { ...c, ...updates } : c))
            ),
        []
    );
    const deleteComponent = useCallback(
        (id) => {
            setComponents((cs) => cs.filter((c) => c.id !== id));
            if (selectedComponent === id) setSelectedComponent(null);
        },
        [selectedComponent]
    );
    const duplicateComponent = useCallback(
        (id) => {
            const compToDup = components.find((c) => c.id === id);
            if (compToDup) {
                const newComp = {
                    ...JSON.parse(JSON.stringify(compToDup)),
                    id: generateId(),
                    x: compToDup.x + 20,
                    y: compToDup.y + 20,
                    zIndex: components.length + 1,
                };
                setComponents((cs) => [...cs, newComp]);
                setSelectedComponent(newComp.id);
            }
        },
        [components]
    );
    const handleSidebarDragStart = (e, componentType) => {
        setDraggedComponentType(componentType);
    };
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
    const handleCanvasDragOver = (e) => e.preventDefault();
    const handleComponentMouseDown = (e, componentId) => {
        if (
            previewMode ||
            (editingComponent && editingComponent.startsWith(componentId)) ||
            actionState.isResizing
        )
            return;
        e.preventDefault();
        e.stopPropagation();
        const component = components.find((c) => c.id === componentId);
        if (!component || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        setSelectedComponent(componentId);
        setActionState({ isDragging: true, isResizing: false });
        if (editingComponent) setEditingComponent(null);
        setDragOffset({
            x: e.clientX - rect.left - component.x,
            y: e.clientY - rect.top - component.y,
        });
    };
    const handleResizeStart = (e, componentId, handle) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedComponent(componentId);
        setActionState({ isDragging: false, isResizing: true });
        setResizeHandle(handle);
    };
    const handleMouseMove = useCallback(
        (e) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if (actionState.isDragging && selectedComponent) {
                const newX = mouseX - dragOffset.x;
                const newY = mouseY - dragOffset.y;
                updateComponent(selectedComponent, {
                    x: Math.max(0, newX),
                    y: Math.max(0, newY),
                });
            } else if (actionState.isResizing && selectedComponent) {
                const component = components.find((c) => c.id === selectedComponent);
                if (!component) return;
                let { x, y, width, height } = component;
                const minWidth = 50,
                    minHeight = 50;
                if (resizeHandle.includes("e")) width = Math.max(minWidth, mouseX - x);
                if (resizeHandle.includes("s"))
                    height = Math.max(minHeight, mouseY - y);
                if (resizeHandle.includes("w")) {
                    const newWidth = x + width - mouseX;
                    if (newWidth > minWidth) {
                        width = newWidth;
                        x = mouseX;
                    }
                }
                if (resizeHandle.includes("n")) {
                    const newHeight = y + height - mouseY;
                    if (newHeight > minHeight) {
                        height = newHeight;
                        y = mouseY;
                    }
                }
                updateComponent(selectedComponent, { x, y, width, height });
            }
        },
        [
            actionState,
            selectedComponent,
            components,
            dragOffset,
            resizeHandle,
            updateComponent,
        ]
    );
    const handleMouseUp = useCallback(
        () => setActionState({ isDragging: false, isResizing: false }),
        []
    );
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
    const contextValue = {
        state: {
            components,
            selectedComponent,
            editingComponent,
            previewMode,
            isResizing: actionState.isResizing,
        },
        actions: {
            updateComponent,
            setEditingComponent: handleSetEditing,
            setSelectedComponent,
            deleteComponent,
            duplicateComponent,
            handleResizeStart,
            handleComponentMouseDown,
        },
    };
    return (
        <BuilderContext.Provider value={contextValue}>
            <div className="h-screen w-screen flex flex-col font-sans bg-gray-100">
                <Header
                    previewMode={previewMode}
                    onTogglePreview={() => setPreviewMode(!previewMode)}
                    onSave={() => alert(JSON.stringify(components))}
                />
                <div className="flex-1 flex overflow-hidden">
                    {!previewMode && <Sidebar onDragStart={handleSidebarDragStart} />}
                    <Canvas
                        components={components}
                        onDrop={handleCanvasDrop}
                        onDragOver={handleCanvasDragOver}
                        onClick={handleCanvasClick}
                    >
                        {(node) => {
                            canvasRef.current = node;
                        }}
                    </Canvas>
                </div>
            </div>
        </BuilderContext.Provider>
    );
};
export default InteractiveMagazineBuilder;