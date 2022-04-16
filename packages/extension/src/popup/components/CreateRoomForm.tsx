import { FormEventHandler, useState } from 'react';

export interface CreateRoomFormProps {
  onCreate: (link: string) => void;
}

export const CreateRoomForm = (props: CreateRoomFormProps) => {
  const [link, setLink] = useState('');

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    props.onCreate(link);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link"
      />
      <button>Create</button>
    </form>
  );
};
