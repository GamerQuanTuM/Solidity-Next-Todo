type ModalProps = {
    isModalOpen: boolean,
    handleCloseModal(): void,
    editedInput: string,
    handleEditedInput(e: ChangeEvent<HTMLInputElement>): void,
    editTodo: (id: BigNumberish, newContent: string) => void,
    id: BigNumberish,
}

declare namespace Todo {
    type TaskStruct = {
        id: BigNumberish;
        content: string;
        completed: boolean;
    };
}


