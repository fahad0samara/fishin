import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";


const Profile = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    console.log(user);
    
  return (
    // <div className="my-4 max-w-screen-md border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4 md:mx-auto">
    //   <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
    //     <div className="shrink-0 mr-auto sm:py-3">
    //       <p className="font-medium">Account Details</p>
    //       <p className="text-sm text-gray-600">Edit your account details</p>

    //     </div>
    //     <button className="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 sm:inline focus:outline-none focus:ring hover:bg-gray-200">
    //       Cancel
    //     </button>
    //     <button className="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white sm:inline focus:outline-none focus:ring hover:bg-blue-700">
    //       Save
    //     </button>
    //   </div>
    //   <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
    //     <p className="shrink-0 w-32 font-medium">Name</p>
    //     <input
    //       placeholder="First Name"
    //       className="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 sm:mr-4 sm:mb-0 focus:ring-1"
    //       value={user?.name}

    //     />
    //     <input
    //       placeholder="Last Name"
    //       className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
    //     />
    //   </div>
    //   <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
    //     <p className="shrink-0 w-32 font-medium">Email</p>
    //     <input
    //       placeholder="your.email@domain.com"
    //       className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
    //     />
    //   </div>
    //   <div className="flex flex-col gap-4 py-4  lg:flex-row">
    //     <div className="shrink-0 w-32  sm:py-4">
    //       <p className="mb-auto font-medium">Avatar</p>
    //       <p className="text-sm text-gray-600">Change your avatar</p>
    //     </div>
    //     <div className="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
    //       <img
    //         src="/images/ddHJYlQqOzyOKm4CSCY8o.png"
    //         className="h-16 w-16 rounded-full"
    //       />
    //       <p className="text-sm text-gray-600">
    //         Drop your desired image file here to start the upload
    //       </p>
    //       <input
    //         type="file"
    //         className="max-w-full rounded-lg px-2 font-medium text-blue-600 outline-none ring-blue-600 focus:ring-1"
    //       />
    //     </div>
    //   </div>
    //   <div className="flex justify-end py-4 sm:hidden">
    //     <button className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 focus:outline-none focus:ring hover:bg-gray-200">
    //       Cancel
    //     </button>
    //     <button className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700">
    //       Save
    //     </button>
    //   </div>
    // </div>


<section className="pt-16 bg-blueGray-50">
<div className="w-full lg:w-4/12 px-4 mx-auto">
  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
    <div className="px-6">
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 flex justify-center">
          <div className="relative">
            <img 
             src={user?.profileImage
} alt="Profile" 
             className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"/>
          </div>
        </div>
        <div className="w-full px-4 text-center mt-20">
          <div className="flex justify-center py-4 lg:pt-4 pt-8">
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                22
              </span>
              <span className="text-sm text-blueGray-400">Friends</span>
            </div>
            <div className="mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                10
              </span>
              <span className="text-sm text-blueGray-400">Photos</span>
            </div>
            <div className="lg:mr-4 p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                89
              </span>
              <span className="text-sm text-blueGray-400">Comments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-12">
        <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
            <h1>Welcome, {user.name}!</h1>
        </h3>
        <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
          <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
     {user.email}
        </div>
        </div>
        </div>
        </div>
        </div>
        
 
</section>
  );
}

export default Profile