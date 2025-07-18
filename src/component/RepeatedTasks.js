const RepeatedTasks = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Repeated Tasks</h2>
          <ul className="space-y-4 list-none p-0 m-0">
            <li className="flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Task 1</h3>
                  <p className="text-gray-500">Description of Task 1</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                  <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Disable</button>
                </div>
            </li>
            <li className="flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Task 2</h3>
                  <p className="text-gray-500">Description of Task 2</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                  <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Disable</button>
                </div>
            </li>
            <li className="flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Task 3</h3>
                  <p className="text-gray-500">Description of Task 3</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                  <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Disable</button>
                </div>
            </li>
            <li className="flex items-center justify-between p-4 rounded-xl border border-gray-200 shadow-sm transition bg-gray-50 hover:bg-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Task 4</h3>
                  <p className="text-gray-500">Description of Task 4</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                  <button className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Disable</button>
                </div>
            </li>
          </ul>
        </div>
    )
}

export default RepeatedTasks;