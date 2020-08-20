import React, { useState, useEffect, useRef } from 'react';
import { PasswordEntry } from '../../Model/Model';
import copy from 'copy-to-clipboard';
import { FaEdit, FaCopy, FaTrashAlt } from 'react-icons/fa';
import NotificationService from '../../Model/NotificationService';
import { conditionalClass } from '../../Utilities/RenderHelpers';
import { useGlobalKeyboardListener } from '../../Utilities/Hooks';
import { createDragModel, DragSource, serializeDragModel } from '../../Utilities/DragModel';

export interface EntryTableProps {
  entries: Array<PasswordEntry>;
  showGroup: boolean;
  openEntry: (entry: PasswordEntry) => void;
  onDeleteEntry: (entry: PasswordEntry) => void;
}

export function EntryTable(props: EntryTableProps) {
  const selectionTrap = useRef<HTMLInputElement>(null);
  const [tableInFocus, setTableInFocus] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry>();

  useGlobalKeyboardListener((event: KeyboardEvent) => {
    if (selectedEntry && document.activeElement === selectionTrap.current) {
      if(event.code === "KeyC" && event.ctrlKey) {
        copyPassword(selectedEntry);
      } else if(event.code === "KeyB" && event.ctrlKey) {
        copyUsername(selectedEntry);
      }
    }
  });

  useEffect(() => {
    setSelectedEntry(undefined);
  }, [props.entries]);

  function copyUsername(entry: PasswordEntry) {
    copy(entry.username);
    NotificationService.showNotification("User name copied!");
  };

  function copyPassword(entry: PasswordEntry) {
    copy(entry.password);
    NotificationService.showNotification("Password copied!");
  };

  function selectEntry(entry: PasswordEntry) {
    setSelectedEntry(entry);
    selectionTrap.current?.focus();
  }

  function renderCell(entry: PasswordEntry, content: JSX.Element) {
    return <td className={"leading-10" + conditionalClass(tableInFocus && selectedEntry === entry, "bg-blue-200")} onClick={() => selectEntry(entry)}>{content}</td>
  }

  function onDragStart(event: React.DragEvent, entry: PasswordEntry) {
    const model = createDragModel(DragSource.Entry, entry.id);
    event.dataTransfer.setData("text/plain", serializeDragModel(model));
    event.dataTransfer.dropEffect = "move";
  }

  return (<>
    <table className="w-full">
      <thead>
        <tr>
          {props.showGroup && <th className="w-1/6">Group</th>}
          <th className="w-1/6">Name</th>
          <th className="">User name</th>
        </tr>
      </thead>
      <tbody>
        {props.entries.map((entry) => 
          <tr key={entry.id}>
            {props.showGroup && renderCell(entry, <>{entry.group.name}</>)}
            {renderCell(entry, <span draggable={true} onDragStart={(e) => onDragStart(e, entry)} ><EntryName entry={entry}/></span>)}
            {renderCell(entry, <>
              {entry.username}
              <div className="float-right">
                  <button className="btn-icon" onClick={() => props.openEntry(entry)} title="Edit entry"><FaEdit/></button>
                  <button className="btn-icon" onClick={() => copyUsername(entry)} title="Copy user name (Ctrl+B)"><FaCopy/></button>
                  <button className="btn-icon" onClick={() => copyPassword(entry)} title="Copy password (Ctrl+C)"><FaCopy/></button>
                  <button className="btn-icon" onClick={() => props.onDeleteEntry(entry)} title="Delete entry"><FaTrashAlt/></button>
                </div>
            </>)}
          </tr>
        )}
      </tbody>
    </table>
    <input type="checkbox" ref={selectionTrap} onFocus={() => setTableInFocus(true)} onBlur={() => setTableInFocus(false)} className="absolute w-0 h-0"/>
    </>
  );
}

interface EntryNameProps {
  entry: PasswordEntry;
}

function EntryName(props: EntryNameProps) {
  const entry = props.entry;

  if (props.entry.containsUrl()) {
    return <a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.name}</a>
  } else {
    return <span>{entry.name}</span>;
  }
}
