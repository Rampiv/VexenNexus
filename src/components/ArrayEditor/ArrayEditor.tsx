import type React from 'react';

interface ArrayEditorProps {
  title: string; // Заголовок блока (например, "Описание (Абзацы)")
  items: string[]; // Массив строк
  setItems: React.Dispatch<React.SetStateAction<string[]>>; // Функция обновления состояния
  placeholder?: string; // Плейсхолдер для textarea
}

export const ArrayEditor: React.FC<ArrayEditorProps> = ({ 
  title, 
  items, 
  setItems, 
  placeholder = "Текст..." 
}) => {
  
  // Изменение текста в конкретном элементе
  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  // Добавление нового пустого элемента
  const addItem = () => {
    setItems([...items, '']);
  };

  // Удаление элемента по индексу
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="array-editor">
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{title}</label>
      
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <textarea
            rows={3}
            value={item}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder={`${placeholder} ${idx + 1}`}
            style={{
              flex: 1,
              background: '#2a2a2a',
              color: '#fff',
              border: '1px solid #444',
              padding: '8px',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <button
            type="button"
            onClick={() => removeItem(idx)}
            style={{
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        style={{
          marginTop: '5px',
          background: '#444',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#555'}
        onMouseOut={(e) => e.currentTarget.style.background = '#444'}
      >
        + Добавить {title.toLowerCase().includes('абзац') ? 'абзац' : 'элемент'}
      </button>
    </div>
  );
};