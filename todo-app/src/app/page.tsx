"use client"
{/* @ts-ignore */}
import { BigNumberish, Contract, ethers } from "ethers";
import { ChangeEvent, FC, useEffect, useState } from "react"
import todoAbi from "@/contract/Todo.json";


const Home:FC = () => {

  const [todos, setTodos] = useState<Todo.TaskStruct[]>([])
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null >(null);
  const [input,setInput] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editedInput,setEditedInput] = useState('')
  const [checkedMap, setCheckedMap] = useState<{ [key in string | number | symbol]: boolean }>({});


  useEffect(()=>{
    const provider:ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    async function loadProvider() {
      if (provider) {
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xe7be316E67b48764f62c7a13F51b8913c58C622B";

        let contract = new ethers.Contract(contractAddress, todoAbi.abi, signer);
        setContract(contract);
        setProvider(provider);
      } else {
        throw new Error(
          "No Provider!! Unable to interact with Smart Contracts"
        );
      }
    }

    if (provider) {
      loadProvider();
    }
  },[])

  useEffect(() => {
    const refreshTodos = async () => {
      if (!contract) return;
      const allTodos = await contract.getAllTasks();
      setTodos(allTodos);
      console.log(allTodos)
    };
  
    refreshTodos()
  }, [contract]);

  const handleCloseModal = () =>{
    setIsModalOpen(false)
  }
  
  const handleEditedInput = (e:ChangeEvent<HTMLInputElement>) =>{
    setEditedInput(e.target.value)
  }
  

  const addTodo = async () =>{
    if(!contract) return
    const addTodos = await contract.createTask(input);
    await addTodos.wait();
    console.log("Todos Added");
    setInput("")
  }

  const deleteTodo = async(id:BigNumberish) =>{
    if(!contract) return;
    await contract.deleteTask(id);
  }

const editTodo = async(id:BigNumberish,newContent:string) =>{
  if(!contract) return;
  const updatedTodos = await contract.updateTask(id,newContent);
  await updatedTodos.wait();
    console.log("Todos Updated");
    setEditedInput("")
    handleCloseModal()
}

const handleCheckboxChange = async (id: BigNumberish) => {
  const stringId = id.toString(); // Convert id to a string
  const newCheckedMap = { ...checkedMap };
  newCheckedMap[stringId] = !newCheckedMap[stringId]; // Toggle the checked state

  setCheckedMap(newCheckedMap);

  if(!contract) return

  const isCompletedTodo = await contract.isCompletedTask(id, newCheckedMap[stringId]);
  await isCompletedTodo.wait();
};

  return (
   <main className="h-screen w-screen">
      <div data-theme="dracula" className="h-full w-full flex items-center flex-col gap-12">
        <section className="mt-10 flex flex-col gap-5 items-center">
            <h1 className="text-white">Connected Wallet Address :- {account || "No account connected"}</h1>
            <h1 className="text-4xl text-white">What&apos;s your plan for today</h1>
            <div className="flex gap-2">
              <div className="form-control w-full max-w-xs">
                <input type="text" placeholder="Add a todo" className="input input-bordered input-primary w-80 max-w-xs" onChange={(e)=>setInput(e.target.value)}/>
              </div>
              <button className="btn btn-secondary rounded-lg" onClick={addTodo} disabled={!input}>Add Todo</button>
            </div>
        </section>
        <section>
            <div className="flex flex-col gap-3">
              {
            todos.filter((todo: Todo.TaskStruct) => todo.content).map((todo:Todo.TaskStruct,index:number)=>{
              return(
                <div className="alert bg-gradient-to-r from-blue-500 to-purple-500 w-[500px] flex justify-between" key={index} >
                  <span className={`${todo.completed === true && "line-through"}`}>{todo.content}</span>
                  <span className="flex gap-3 items-center cursor-pointer">

                    <input type="checkbox" className="w-4 h-4" checked={todo.completed === true}
                    onChange={() => handleCheckboxChange(todo.id)}/>

                    <svg onClick={()=>deleteTodo(todo.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5" onClick={()=>setIsModalOpen(true)}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.252.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </span>
                    <Modal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} 
                    editedInput={editedInput}
                    handleEditedInput={handleEditedInput} editTodo={editTodo} id={todo.id}/>
                </div>
              )})
            }
            </div>
        </section>
      </div>
   </main>
  )
}

const Modal = ({isModalOpen,handleCloseModal,handleEditedInput,editTodo,id,editedInput}:ModalProps) => (
  <>
    {isModalOpen && <div className="fixed inset-0 flex items-center justify-center z-50">
      <div data-theme="corporate" className="bg-white rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
      <input
      type="text"
      placeholder="Edit todo..."
      className="input input-bordered w-full mb-4"
      onChange={handleEditedInput}
      />
      <div className="flex justify-end">
      <button className="btn btn-primary mr-2" onClick={()=>editTodo(id,editedInput)}>Save</button>
      <button className="btn btn-neutral" onClick={handleCloseModal}>Cancel</button>
    </div>
  </div>
    </div>}
  </>
)

export default Home
