import React, { useEffect, useState } from 'react';
import * as bi from 'react-icons/bi';
import emojis from '../../../json/emoji.json';

function EmojiBoard({ setForm }) {
  const [category, setCategory] = useState('Smileys & Emotion');

  useEffect(() => {
    const monitor = document.querySelector('#monitor');
    monitor.scrollTop += 192;
  }, []);

  return (
    <div className="grid grid-rows-[1fr_auto]">
      <div
        className="h-36 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(36px, 1fr))',
        }}
      >
        {emojis
          .filter((elem) => elem.category === category)
          .map((elem) => (
            <button
              key={elem.emoji}
              type="button"
              className="w-9 h-9 text-2xl rounded-full hover:bg-spill-200 dark:hover:bg-spill-700"
              onClick={() => {
                const input = document.querySelector('#new-message');

                setForm((prev) => {
                  const arr = prev.text.split('');
                  arr.splice(input.selectionStart, 0, elem.emoji);

                  return { ...prev, text: arr.join('') };
                });

                input.focus();
              }}
            >
              {elem.emoji}
            </button>
          ))}
      </div>
      <div className="flex justify-center">
        <div className="px-4 h-12 max-w-[460px] w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] items-center">
          {[
            { category: 'Smileys & Emotion', icon: <bi.BiSmile /> },
            { category: 'People & Body', icon: <bi.BiWalk /> },
            { category: 'Animals & Nature', icon: <bi.BiBug /> },
            { category: 'Food & Drink', icon: <bi.BiCoffee /> },
            { category: 'Travel & Places', icon: <bi.BiCar /> },
            { category: 'Activities', icon: <bi.BiFootball /> },
            { category: 'Objects', icon: <bi.BiBulb /> },
            { category: 'Symbols', icon: <bi.BiShapeSquare /> },
            { category: 'Flags', icon: <bi.BiFlag /> },
          ].map((elem) => (
            <span key={elem.category} className="flex">
              <button
                type="button"
                className={`${
                  elem.category === category &&
                  'opacity-100 text-sky-600 dark:text-sky-400'
                } opacity-60 hover:opacity-100`}
                onClick={() => {
                  setCategory(elem.category);
                }}
              >
                <i>{elem.icon}</i>
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmojiBoard;
