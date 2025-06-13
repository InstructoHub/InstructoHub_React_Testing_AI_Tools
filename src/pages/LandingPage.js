import React, { useState, useRef, useCallback } from 'react';
import { Type, Image, Video, Lightbulb, Quote, Star, ChevronDown, FileText, Move, Trash2, Copy, Eye, Save, Layers, Edit3, Upload, X, Check, Plus, Minus } from 'lucide-react';

const InteractiveMagazineBuilder = () => {
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [editingComponent, setEditingComponent] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [canvasBackground, setCanvasBackground] = useState('#ffffff');
    const [draggedComponent, setDraggedComponent] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState(null);
    const canvasRef = useRef(null);

    const componentLibrary = [
        {
            id: 'heading',
            name: 'Heading',
            icon: Type,
            color: 'bg-blue-600',
            defaultProps: {
                content: 'Your Heading Here',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'left'
            }
        },
        {
            id: 'text',
            name: 'Text Block',
            icon: Type,
            color: 'bg-blue-400',
            defaultProps: {
                content: 'Add your text content here. Click to edit this text and customize it for your students.',
                fontSize: 16,
                color: '#374151',
                lineHeight: 1.6
            }
        },
        {
            id: 'image',
            name: 'Image',
            icon: Image,
            color: 'bg-green-500',
            defaultProps: {
                src: '',
                alt: 'Educational image',
                caption: 'Click to add image caption'
            }
        },
        {
            id: 'accordion',
            name: 'Accordion',
            icon: ChevronDown,
            color: 'bg-indigo-500',
            defaultProps: {
                items: [
                    { id: 1, title: 'First Section', content: 'Content for first section', isOpen: false },
                    { id: 2, title: 'Second Section', content: 'Content for second section', isOpen: false }
                ]
            }
        },
        {
            id: 'tabs',
            name: 'Tabs',
            icon: FileText,
            color: 'bg-cyan-500',
            defaultProps: {
                activeTab: 0,
                tabs: [
                    { id: 1, title: 'Tab 1', content: 'Content for first tab' },
                    { id: 2, title: 'Tab 2', content: 'Content for second tab' }
                ]
            }
        },
        {
            id: 'table',
            name: 'Table',
            icon: FileText,
            color: 'bg-gray-600',
            defaultProps: {
                headers: ['Header 1', 'Header 2', 'Header 3'],
                rows: [
                    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
                    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
                ]
            }
        },
        {
            id: 'didyouknow',
            name: 'Did You Know',
            icon: Lightbulb,
            color: 'bg-yellow-500',
            defaultProps: {
                title: 'Did You Know?',
                content: 'Click to add an interesting fact that will engage your students!'
            }
        },
        {
            id: 'highlight',
            name: 'Highlight Box',
            icon: Star,
            color: 'bg-pink-500',
            defaultProps: {
                content: 'Click to add important information',
                variant: 'info'
            }
        },
        {
            id: 'quote',
            name: 'Quote',
            icon: Quote,
            color: 'bg-purple-500',
            defaultProps: {
                text: 'Click to add an inspiring quote',
                author: 'Author Name'
            }
        },
        {
            id: 'video',
            name: 'Video',
            icon: Video,
            color: 'bg-red-500',
            defaultProps: {
                title: 'Click to add video title',
                url: '',
                thumbnail: ''
            }
        }
    ];

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const createComponent = (type, x = 50, y = 50) => {
        const template = componentLibrary.find(comp => comp.id === type);
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
            quote: 350
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
            quote: 100
        };
        return {
            id: generateId(),
            type,
            x,
            y,
            width: widthMap[type] || 320,
            height: heightMap[type] || 100,
            zIndex: components.length + 1,
            ...template.defaultProps
        };
    };

    const handleDragStart = (e, componentType) => {
        setDraggedComponent(componentType);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        if (!draggedComponent || previewMode) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newComponent = createComponent(draggedComponent, x, y);
        setComponents([...components, newComponent]);
        setSelectedComponent(newComponent.id);
        setDraggedComponent(null);
    };

    const handleCanvasDragOver = (e) => {
        e.preventDefault();
    };

    const handleComponentMouseDown = (e, componentId) => {
        if (previewMode || editingComponent) return;

        e.preventDefault();
        e.stopPropagation();

        const component = components.find(c => c.id === componentId);
        const rect = canvasRef.current.getBoundingClientRect();

        setSelectedComponent(componentId);
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - rect.left - component.x,
            y: e.clientY - rect.top - component.y
        });
    };

    const handleResizeStart = (e, componentId, handle) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedComponent(componentId);
        setIsResizing(true);
        setResizeHandle(handle);
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging && selectedComponent && !isResizing) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffset.x;
            const newY = e.clientY - rect.top - dragOffset.y;

            setComponents(components.map(comp =>
                comp.id === selectedComponent
                    ? { ...comp, x: Math.max(0, newX), y: Math.max(0, newY) }
                    : comp
            ));
        } else if (isResizing && selectedComponent) {
            const rect = canvasRef.current.getBoundingClientRect();
            const component = components.find(c => c.id === selectedComponent);
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let updates = {};

            if (resizeHandle === 'se') {
                updates.width = Math.max(100, mouseX - component.x);
                updates.height = Math.max(50, mouseY - component.y);
            } else if (resizeHandle === 'e') {
                updates.width = Math.max(100, mouseX - component.x);
            } else if (resizeHandle === 's') {
                updates.height = Math.max(50, mouseY - component.y);
            }

            setComponents(components.map(comp =>
                comp.id === selectedComponent ? { ...comp, ...updates } : comp
            ));
        }
    }, [isDragging, isResizing, selectedComponent, dragOffset, resizeHandle, components]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle(null);
    }, []);

    React.useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    const handleCanvasClick = (e) => {
        if (e.target === canvasRef.current) {
            setSelectedComponent(null);
            setEditingComponent(null);
        }
    };

    const updateComponent = (id, updates) => {
        setComponents(components.map(comp =>
            comp.id === id ? { ...comp, ...updates } : comp
        ));
    };

    const deleteComponent = (id) => {
        setComponents(components.filter(comp => comp.id !== id));
        setSelectedComponent(null);
        setEditingComponent(null);
    };

    const duplicateComponent = (id) => {
        const component = components.find(comp => comp.id === id);
        if (component) {
            const newComponent = {
                ...component,
                id: generateId(),
                x: component.x + 20,
                y: component.y + 20,
                zIndex: Math.max(...components.map(c => c.zIndex)) + 1
            };
            setComponents([...components, newComponent]);
            setSelectedComponent(newComponent.id);
        }
    };

    const startEditing = (componentId) => {
        setEditingComponent(componentId);
    };

    const stopEditing = () => {
        setEditingComponent(null);
    };

    const addAccordionItem = (componentId) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'accordion') {
            const newItem = {
                id: Date.now(),
                title: 'New Section',
                content: 'Add content here',
                isOpen: false
            };
            updateComponent(componentId, {
                items: [...component.items, newItem]
            });
        }
    };

    const removeAccordionItem = (componentId, itemId) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'accordion') {
            updateComponent(componentId, {
                items: component.items.filter(item => item.id !== itemId)
            });
        }
    };

    const updateAccordionItem = (componentId, itemId, updates) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'accordion') {
            updateComponent(componentId, {
                items: component.items.map(item =>
                    item.id === itemId ? { ...item, ...updates } : item
                )
            });
        }
    };

    const addTab = (componentId) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'tabs') {
            const newTab = {
                id: Date.now(),
                title: 'New Tab',
                content: 'Add tab content here'
            };
            updateComponent(componentId, {
                tabs: [...component.tabs, newTab]
            });
        }
    };

    const removeTab = (componentId, tabId) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'tabs' && component.tabs.length > 1) {
            const newTabs = component.tabs.filter(tab => tab.id !== tabId);
            updateComponent(componentId, {
                tabs: newTabs,
                activeTab: Math.min(component.activeTab, newTabs.length - 1)
            });
        }
    };

    const addTableRow = (componentId) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'table') {
            const newRow = new Array(component.headers.length).fill('New cell');
            updateComponent(componentId, {
                rows: [...component.rows, newRow]
            });
        }
    };

    const addTableColumn = (componentId) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'table') {
            updateComponent(componentId, {
                headers: [...component.headers, 'New Header'],
                rows: component.rows.map(row => [...row, 'New cell'])
            });
        }
    };

    const removeTableRow = (componentId, rowIndex) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'table' && component.rows.length > 1) {
            updateComponent(componentId, {
                rows: component.rows.filter((_, index) => index !== rowIndex)
            });
        }
    };

    const removeTableColumn = (componentId, colIndex) => {
        const component = components.find(c => c.id === componentId);
        if (component && component.type === 'table' && component.headers.length > 1) {
            updateComponent(componentId, {
                headers: component.headers.filter((_, index) => index !== colIndex),
                rows: component.rows.map(row => row.filter((_, index) => index !== colIndex))
            });
        }
    };

    const handleImageUpload = (componentId, file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateComponent(componentId, { src: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const EditableText = ({ component, field, placeholder, style = {} }) => {
        const [value, setValue] = useState(component[field]);

        if (editingComponent === component.id) {
            return (
                <div style={{ position: 'relative' }}>
                    {field === 'content' && component.type === 'text' ? (
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={() => {
                                updateComponent(component.id, { [field]: value });
                                stopEditing();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    updateComponent(component.id, { [field]: value });
                                    stopEditing();
                                }
                                if (e.key === 'Escape') {
                                    setValue(component[field]);
                                    stopEditing();
                                }
                            }}
                            autoFocus
                            style={{
                                ...style,
                                border: '2px solid #3b82f6',
                                borderRadius: '4px',
                                padding: '8px',
                                resize: 'none',
                                width: '100%',
                                height: '80px',
                                fontFamily: 'inherit'
                            }}
                            placeholder={placeholder}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={() => {
                                updateComponent(component.id, { [field]: value });
                                stopEditing();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    updateComponent(component.id, { [field]: value });
                                    stopEditing();
                                }
                                if (e.key === 'Escape') {
                                    setValue(component[field]);
                                    stopEditing();
                                }
                            }}
                            autoFocus
                            style={{
                                ...style,
                                border: '2px solid #3b82f6',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                width: '100%',
                                fontFamily: 'inherit',
                                background: 'white'
                            }}
                            placeholder={placeholder}
                        />
                    )}
                </div>
            );
        }

        return (
            <div
                style={{ ...style, cursor: previewMode ? 'default' : 'pointer' }}
                onClick={(e) => {
                    if (!previewMode) {
                        e.stopPropagation();
                        startEditing(component.id);
                    }
                }}
                title={previewMode ? '' : 'Click to edit'}
            >
                {component[field] || placeholder}
            </div>
        );
    };

    const ComponentRenderer = ({ component }) => {
        const isSelected = selectedComponent === component.id && !previewMode;
        const isEditing = editingComponent === component.id;

        const commonStyle = {
            position: 'absolute',
            left: component.x,
            top: component.y,
            width: component.width,
            height: component.height,
            zIndex: component.zIndex,
            cursor: previewMode ? 'default' : (isDragging || isResizing ? 'grabbing' : 'grab')
        };

        const selectionStyle = isSelected ? {
            outline: '2px solid #3b82f6',
            outlineOffset: '2px'
        } : {};

        let content;

        switch (component.type) {
            case 'heading':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <EditableText
                            component={component}
                            field="content"
                            placeholder="Click to edit heading"
                            style={{
                                fontSize: component.fontSize,
                                fontWeight: component.fontWeight,
                                color: component.color,
                                textAlign: component.textAlign,
                                margin: 0,
                                lineHeight: 1.2,
                                width: '100%'
                            }}
                        />
                    </div>
                );
                break;

            case 'accordion':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        {component.items.map((item, index) => (
                            <div key={item.id}>
                                <div
                                    style={{
                                        padding: '10px',
                                        backgroundColor: '#f9fafb',
                                        borderBottom: item.isOpen ? '1px solid #e5e7eb' : (index < component.items.length - 1 ? '1px solid #e5e7eb' : 'none'),
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateAccordionItem(component.id, item.id, { isOpen: !item.isOpen });
                                    }}
                                >
                                    {editingComponent === `${component.id}-${item.id}-title` ? (
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateAccordionItem(component.id, item.id, { title: e.target.value })}
                                            onBlur={() => stopEditing()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === 'Escape') stopEditing();
                                            }}
                                            autoFocus
                                            style={{
                                                border: '1px solid #3b82f6',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                width: '200px'
                                            }}
                                        />
                                    ) : (
                                        <span
                                            style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}
                                            onClick={(e) => {
                                                if (!previewMode) {
                                                    e.stopPropagation();
                                                    setEditingComponent(`${component.id}-${item.id}-title`);
                                                }
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {!previewMode && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAccordionItem(component.id, item.id);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    padding: '2px'
                                                }}
                                                title="Remove item"
                                            >
                                                <Minus size={14} />
                                            </button>
                                        )}
                                        <ChevronDown
                                            size={16}
                                            style={{
                                                color: '#6b7280',
                                                transform: item.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </div>
                                </div>
                                {item.isOpen && (
                                    <div style={{ padding: '12px' }}>
                                        {editingComponent === `${component.id}-${item.id}-content` ? (
                                            <textarea
                                                value={item.content}
                                                onChange={(e) => updateAccordionItem(component.id, item.id, { content: e.target.value })}
                                                onBlur={() => stopEditing()}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') stopEditing();
                                                }}
                                                autoFocus
                                                style={{
                                                    border: '1px solid #3b82f6',
                                                    borderRadius: '4px',
                                                    padding: '6px',
                                                    fontSize: '13px',
                                                    width: '100%',
                                                    height: '60px',
                                                    resize: 'none'
                                                }}
                                            />
                                        ) : (
                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: '#6b7280',
                                                    fontSize: '13px',
                                                    lineHeight: 1.5,
                                                    cursor: previewMode ? 'default' : 'pointer'
                                                }}
                                                onClick={(e) => {
                                                    if (!previewMode) {
                                                        e.stopPropagation();
                                                        setEditingComponent(`${component.id}-${item.id}-content`);
                                                    }
                                                }}
                                            >
                                                {item.content}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {!previewMode && (
                            <div style={{
                                padding: '8px',
                                borderTop: '1px solid #e5e7eb',
                                backgroundColor: '#f9fafb',
                                textAlign: 'center'
                            }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addAccordionItem(component.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: '1px dashed #9ca3af',
                                        color: '#6b7280',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        margin: '0 auto'
                                    }}
                                >
                                    <Plus size={12} /> Add Section
                                </button>
                            </div>
                        )}
                    </div>
                );
                break;

            case 'tabs':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        {/* Tab Headers */}
                        <div style={{
                            display: 'flex',
                            backgroundColor: '#f9fafb',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            {component.tabs.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        backgroundColor: component.activeTab === index ? '#ffffff' : 'transparent',
                                        borderBottom: component.activeTab === index ? '2px solid #3b82f6' : '2px solid transparent',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: component.activeTab === index ? '#3b82f6' : '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateComponent(component.id, { activeTab: index });
                                    }}
                                >
                                    {editingComponent === `${component.id}-tab-${tab.id}-title` ? (
                                        <input
                                            type="text"
                                            value={tab.title}
                                            onChange={(e) => {
                                                const newTabs = component.tabs.map(t =>
                                                    t.id === tab.id ? { ...t, title: e.target.value } : t
                                                );
                                                updateComponent(component.id, { tabs: newTabs });
                                            }}
                                            onBlur={() => stopEditing()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === 'Escape') stopEditing();
                                            }}
                                            autoFocus
                                            style={{
                                                border: '1px solid #3b82f6',
                                                borderRadius: '4px',
                                                padding: '2px 4px',
                                                fontSize: '13px',
                                                width: '80px'
                                            }}
                                        />
                                    ) : (
                                        <span
                                            onClick={(e) => {
                                                if (!previewMode) {
                                                    e.stopPropagation();
                                                    setEditingComponent(`${component.id}-tab-${tab.id}-title`);
                                                }
                                            }}
                                        >
                                            {tab.title}
                                        </span>
                                    )}
                                    {!previewMode && component.tabs.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTab(component.id, tab.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: '1px'
                                            }}
                                            title="Remove tab"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {!previewMode && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addTab(component.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#9ca3af',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        fontSize: '12px'
                                    }}
                                    title="Add tab"
                                >
                                    <Plus size={14} />
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div style={{ padding: '12px' }}>
                            {component.tabs[component.activeTab] && (
                                editingComponent === `${component.id}-tab-${component.tabs[component.activeTab].id}-content` ? (
                                    <textarea
                                        value={component.tabs[component.activeTab].content}
                                        onChange={(e) => {
                                            const newTabs = component.tabs.map(t =>
                                                t.id === component.tabs[component.activeTab].id
                                                    ? { ...t, content: e.target.value }
                                                    : t
                                            );
                                            updateComponent(component.id, { tabs: newTabs });
                                        }}
                                        onBlur={() => stopEditing()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') stopEditing();
                                        }}
                                        autoFocus
                                        style={{
                                            border: '1px solid #3b82f6',
                                            borderRadius: '4px',
                                            padding: '6px',
                                            fontSize: '13px',
                                            width: '100%',
                                            height: '120px',
                                            resize: 'none'
                                        }}
                                    />
                                ) : (
                                    <p
                                        style={{
                                            margin: 0,
                                            color: '#374151',
                                            fontSize: '13px',
                                            lineHeight: 1.5,
                                            cursor: previewMode ? 'default' : 'pointer'
                                        }}
                                        onClick={(e) => {
                                            if (!previewMode) {
                                                e.stopPropagation();
                                                setEditingComponent(`${component.id}-tab-${component.tabs[component.activeTab].id}-content`);
                                            }
                                        }}
                                    >
                                        {component.tabs[component.activeTab].content}
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                );
                break;

            case 'table':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    {component.headers.map((header, colIndex) => (
                                        <th
                                            key={colIndex}
                                            style={{
                                                padding: '8px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #e5e7eb',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#374151',
                                                position: 'relative'
                                            }}
                                        >
                                            {editingComponent === `${component.id}-header-${colIndex}` ? (
                                                <input
                                                    type="text"
                                                    value={header}
                                                    onChange={(e) => {
                                                        const newHeaders = [...component.headers];
                                                        newHeaders[colIndex] = e.target.value;
                                                        updateComponent(component.id, { headers: newHeaders });
                                                    }}
                                                    onBlur={() => stopEditing()}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Escape') stopEditing();
                                                    }}
                                                    autoFocus
                                                    style={{
                                                        border: '1px solid #3b82f6',
                                                        borderRadius: '4px',
                                                        padding: '2px 4px',
                                                        fontSize: '12px',
                                                        width: '100%'
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    onClick={(e) => {
                                                        if (!previewMode) {
                                                            e.stopPropagation();
                                                            setEditingComponent(`${component.id}-header-${colIndex}`);
                                                        }
                                                    }}
                                                    style={{ cursor: previewMode ? 'default' : 'pointer' }}
                                                >
                                                    {header}
                                                </span>
                                            )}
                                            {!previewMode && component.headers.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeTableColumn(component.id, colIndex);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        right: '2px',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        fontSize: '10px'
                                                    }}
                                                    title="Remove column"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </th>
                                    ))}
                                    {!previewMode && (
                                        <th style={{ padding: '4px', width: '20px' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addTableColumn(component.id);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: '1px dashed #9ca3af',
                                                    borderRadius: '2px',
                                                    color: '#6b7280',
                                                    cursor: 'pointer',
                                                    padding: '2px',
                                                    fontSize: '10px'
                                                }}
                                                title="Add column"
                                            >
                                                <Plus size={10} />
                                            </button>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {component.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td
                                                key={colIndex}
                                                style={{
                                                    padding: '6px 8px',
                                                    borderBottom: '1px solid #f3f4f6',
                                                    fontSize: '11px',
                                                    color: '#374151',
                                                    position: 'relative'
                                                }}
                                            >
                                                {editingComponent === `${component.id}-cell-${rowIndex}-${colIndex}` ? (
                                                    <input
                                                        type="text"
                                                        value={cell}
                                                        onChange={(e) => {
                                                            const newRows = [...component.rows];
                                                            newRows[rowIndex][colIndex] = e.target.value;
                                                            updateComponent(component.id, { rows: newRows });
                                                        }}
                                                        onBlur={() => stopEditing()}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Escape') stopEditing();
                                                        }}
                                                        autoFocus
                                                        style={{
                                                            border: '1px solid #3b82f6',
                                                            borderRadius: '4px',
                                                            padding: '2px 4px',
                                                            fontSize: '11px',
                                                            width: '100%'
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={(e) => {
                                                            if (!previewMode) {
                                                                e.stopPropagation();
                                                                setEditingComponent(`${component.id}-cell-${rowIndex}-${colIndex}`);
                                                            }
                                                        }}
                                                        style={{ cursor: previewMode ? 'default' : 'pointer' }}
                                                    >
                                                        {cell}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        {!previewMode && (
                                            <td style={{ padding: '2px', width: '20px' }}>
                                                {component.rows.length > 1 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeTableRow(component.id, rowIndex);
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#ef4444',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                        title="Remove row"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {!previewMode && (
                                    <tr>
                                        <td
                                            colSpan={component.headers.length + 1}
                                            style={{
                                                padding: '4px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #e5e7eb'
                                            }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addTableRow(component.id);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: '1px dashed #9ca3af',
                                                    borderRadius: '4px',
                                                    color: '#6b7280',
                                                    cursor: 'pointer',
                                                    padding: '2px 6px',
                                                    fontSize: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                    margin: '0 auto'
                                                }}
                                                title="Add row"
                                            >
                                                <Plus size={10} /> Add Row
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
                break;

            case 'text':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            padding: '6px',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <EditableText
                            component={component}
                            field="content"
                            placeholder="Click to edit text content"
                            style={{
                                fontSize: component.fontSize,
                                color: component.color,
                                lineHeight: component.lineHeight,
                                margin: 0,
                                width: '100%'
                            }}
                        />
                    </div>
                );
                break;

            case 'image':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        {component.src ? (
                            <>
                                <img
                                    src={component.src}
                                    alt={component.alt}
                                    style={{
                                        width: '100%',
                                        height: 'calc(100% - 25px)',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '2px 6px' }}>
                                    <EditableText
                                        component={component}
                                        field="caption"
                                        placeholder="Click to add caption"
                                        style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            fontStyle: 'italic',
                                            textAlign: 'center',
                                            margin: 0
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280'
                            }}>
                                <Upload size={32} style={{ marginBottom: '12px' }} />
                                <p style={{ margin: '0 0 12px 0', fontWeight: '500' }}>Click to upload image</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            handleImageUpload(component.id, e.target.files[0]);
                                        }
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                    </div>
                );
                break;

            case 'didyouknow':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: '#fef3c7',
                            borderLeft: '4px solid #f59e0b',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Lightbulb size={16} style={{ color: '#d97706', marginRight: '6px', marginTop: '2px', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <EditableText
                                    component={component}
                                    field="title"
                                    placeholder="Click to edit title"
                                    style={{
                                        color: '#92400e',
                                        margin: '0 0 4px 0',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}
                                />
                                <EditableText
                                    component={component}
                                    field="content"
                                    placeholder="Click to add interesting fact"
                                    style={{
                                        color: '#78350f',
                                        margin: 0,
                                        fontSize: '12px',
                                        lineHeight: 1.4
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'highlight':
                const variants = {
                    info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
                    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
                    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
                    error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
                };
                const variant = variants[component.variant] || variants.info;

                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: variant.bg,
                            borderLeft: `4px solid ${variant.border}`,
                            borderRadius: '8px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <EditableText
                            component={component}
                            field="content"
                            placeholder="Click to add important information"
                            style={{
                                color: variant.text,
                                fontWeight: '500',
                                margin: 0,
                                fontSize: '12px'
                            }}
                        />
                    </div>
                );
                break;

            case 'quote':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: '#f8fafc',
                            borderLeft: '4px solid #64748b',
                            borderRadius: '8px',
                            padding: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <blockquote style={{ margin: 0 }}>
                            <EditableText
                                component={component}
                                field="text"
                                placeholder="Click to add quote text"
                                style={{
                                    fontSize: '14px',
                                    fontStyle: 'italic',
                                    color: '#374151',
                                    margin: '0 0 6px 0',
                                    lineHeight: 1.4
                                }}
                            />
                            <EditableText
                                component={component}
                                field="author"
                                placeholder="Click to add author"
                                style={{
                                    color: '#6b7280',
                                    fontWeight: '500',
                                    fontSize: '12px'
                                }}
                            />
                        </blockquote>
                    </div>
                );
                break;

            case 'video':
                content = (
                    <div
                        style={{
                            ...commonStyle,
                            ...selectionStyle,
                            backgroundColor: '#1f2937',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                        onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                    >
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#374151',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            padding: '12px'
                        }}>
                            <Video size={28} style={{ marginBottom: '8px', opacity: 0.7 }} />
                            <EditableText
                                component={component}
                                field="title"
                                placeholder="Click to add video title"
                                style={{
                                    color: 'white',
                                    margin: '0 0 4px 0',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }}
                            />
                            <EditableText
                                component={component}
                                field="url"
                                placeholder="Click to add video URL"
                                style={{
                                    color: '#d1d5db',
                                    margin: 0,
                                    fontSize: '10px',
                                    textAlign: 'center'
                                }}
                            />
                        </div>
                    </div>
                );
                break;

            default:
                content = null;
        }

        return (
            <div>
                {content}
                {isSelected && !isEditing && (
                    <>
                        {/* Control buttons */}
                        <div style={{
                            position: 'absolute',
                            left: component.x,
                            top: component.y - 40,
                            display: 'flex',
                            gap: '4px',
                            backgroundColor: '#1f2937',
                            padding: '4px',
                            borderRadius: '6px',
                            zIndex: 10000
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); startEditing(component.id); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Edit"
                            >
                                <Edit3 size={14} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); duplicateComponent(component.id); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Duplicate"
                            >
                                <Copy size={14} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteComponent(component.id); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {/* Resize handles */}
                        <div
                            style={{
                                position: 'absolute',
                                left: component.x + component.width - 6,
                                top: component.y + component.height - 6,
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#3b82f6',
                                cursor: 'se-resize',
                                border: '2px solid white',
                                borderRadius: '2px',
                                zIndex: 10001
                            }}
                            onMouseDown={(e) => handleResizeStart(e, component.id, 'se')}
                            title="Resize"
                        />
                        <div
                            style={{
                                position: 'absolute',
                                left: component.x + component.width - 6,
                                top: component.y + component.height / 2 - 6,
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#3b82f6',
                                cursor: 'e-resize',
                                border: '2px solid white',
                                borderRadius: '2px',
                                zIndex: 10001
                            }}
                            onMouseDown={(e) => handleResizeStart(e, component.id, 'e')}
                            title="Resize width"
                        />
                        <div
                            style={{
                                position: 'absolute',
                                left: component.x + component.width / 2 - 6,
                                top: component.y + component.height - 6,
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#3b82f6',
                                cursor: 's-resize',
                                border: '2px solid white',
                                borderRadius: '2px',
                                zIndex: 10001
                            }}
                            onMouseDown={(e) => handleResizeStart(e, component.id, 's')}
                            title="Resize height"
                        />
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                    📖 InstructoHub Magazine Builder
                </h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: previewMode ? '#3b82f6' : '#f3f4f6',
                            color: previewMode ? 'white' : '#374151',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '500'
                        }}
                    >
                        <Eye size={16} />
                        {previewMode ? 'Edit Mode' : 'Preview'}
                    </button>
                    <button
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#10b981',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '500'
                        }}
                    >
                        <Save size={16} />
                        Save Page
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex' }}>
                {/* Sidebar */}
                {!previewMode && (
                    <div style={{
                        width: '280px',
                        backgroundColor: '#f8fafc',
                        borderRight: '1px solid #e5e7eb',
                        overflow: 'auto'
                    }}>
                        <div style={{ padding: '20px' }}>
                            <h2 style={{
                                margin: '0 0 16px 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                📦 Components
                            </h2>
                            <p style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                margin: '0 0 16px 0'
                            }}>
                                Drag components onto the canvas, then click to edit text or upload images
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {componentLibrary.map((component) => {
                                    const IconComponent = component.icon;
                                    return (
                                        <div
                                            key={component.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, component.id)}
                                            style={{
                                                padding: '12px 8px',
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                cursor: 'grab',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                border: '1px solid #e5e7eb',
                                                transition: 'all 0.2s',
                                                textAlign: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                margin: '0 auto 6px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }} className={component.color}>
                                                <IconComponent size={16} color="white" />
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '11px',
                                                fontWeight: '500',
                                                color: '#374151'
                                            }}>
                                                {component.name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Canvas */}
                <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                    <div
                        ref={canvasRef}
                        style={{
                            minHeight: '100%',
                            backgroundColor: canvasBackground,
                            position: 'relative',
                            backgroundImage: !previewMode ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)' : 'none',
                            backgroundSize: !previewMode ? '20px 20px' : 'auto'
                        }}
                        onClick={handleCanvasClick}
                        onDrop={handleCanvasDrop}
                        onDragOver={handleCanvasDragOver}
                    >
                        {components.length === 0 && !previewMode && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                color: '#9ca3af'
                            }}>
                                <Layers size={64} style={{ margin: '0 auto 16px' }} />
                                <h3 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>
                                    Create Your Magazine Page
                                </h3>
                                <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
                                    Drag components from the sidebar and position them anywhere
                                </p>
                                <p style={{ fontSize: '14px', margin: 0, color: '#6b7280' }}>
                                    Click any text to edit • Upload images • Drag to move
                                </p>
                            </div>
                        )}

                        {components.map(component => (
                            <ComponentRenderer key={component.id} component={component} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMagazineBuilder;