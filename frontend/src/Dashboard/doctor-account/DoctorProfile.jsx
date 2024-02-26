/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import uploadImageToCloudinary from '../../utils/uploadCloudinary'
import { BASE_URL, token } from '../../config'
import { toast } from "react-toastify";
import PulseLoader from 'react-spinners/PulseLoader';

const DoctorProfile = ({ doctorData }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ 
        name: doctorData?.name || '',
        email: doctorData?.email,
        phone: doctorData?.phone,
        bio: doctorData?.bio,
        gender: doctorData?.gender,
        specialization: doctorData?.specialization,
        ticketPrice: doctorData?.ticketPrice || 0,
        qualifications: doctorData?.qualifications.length ?  doctorData?.qualifications : [{ startingDate: '', endingDate: '', degree: '', university: '' }],
        experiences: doctorData?.experiences || [{ startingDate: '', endingDate: '', position: '', hospital: '' }],
        timeSlots: doctorData?.timeSlots || [{ day: '', startingTime: '', endingTime: '' }],
        about: doctorData?.about || '',
        photo: doctorData?.photo || null
    })

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileInputChange = async e => {
        const file = e.target.files[0];
        const data = await uploadImageToCloudinary(file);

        setFormData({ ...formData, photo: data?.secure_url })
    }

    const updateProfileHandler = async e => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const result = await res.json()
            console.log(result, 'result')

            if(!res.ok) throw Error(result.message)
            setLoading(false)
            toast.success(result.message)
        } catch (error) {
            console.log(error, 'error')
            toast.error(error.message)
        }
    }

    // reusable function from adding item 
    const addItem = (key, item) => {
        setFormData(prevFormData => {
            return ({ ...prevFormData, [key]: [ ...prevFormData[key], item]}) })        
    }

    // reuseable input change function
    const handleReuseableInputChangeFunc = (key, index, event) => {
        const { name, value } = event.target;
console.log(name, value, key, index)
        setFormData(prevFormData => {
            const updateItems = [ ...prevFormData[key]]
            console.log([ ...prevFormData[key]], 'update Items')
            updateItems[index][name] = value;

            return {
                ...prevFormData,
                [key]: updateItems
            }
        })
    }

    const handleNewFormChange = (event, index, key) => {
        handleReuseableInputChangeFunc(key, index, event)
    }

    // reuseable function for deleting item 
    const deleteItem = (key, index) => {
        setFormData(prevFormData => ({ ...prevFormData, [key]: prevFormData[key].filter((_, i) => i !== index)}))
    }

    const addNewFormRow = (e, key) => {
        e.preventDefault()
        if(key === 'qualifications'){
            addItem(key, { startingDate: '', endingDate: '', degree: '', university: '' })
        }
        if(key === 'experiences'){
            addItem(key, { startingDate: '', endingDate: '', position: '', hospital: '' })
        }
        if(key === 'timeSlots'){
            addItem(key, { day: '', startingTime: '', endingTime: '' })
        }
        
    }

    const resetFormRow = (key, index, initialValue) => {
        setFormData(prevFormData => {
            const updateItems = [ ...prevFormData[key]]
            updateItems[index] = initialValue
            return { ...prevFormData, [key]: updateItems }
        })
    }
    const deleteFormRow = (e, index, key) => {
        e.preventDefault();
        if(formData[key].length === 1) {
            if(key === 'qualifications'){
                resetFormRow(key, index, { startingDate: '', endingDate: '', degree: '', university: '' })
            }
            if(key === 'experiences'){
                resetFormRow(key, index, { startingDate: '', endingDate: '', position: '', hospital: '' })
            }
            if(key === 'timeSlots'){
                resetFormRow(key, index, { day: '', startingTime: '', endingTime: '' })
            }
        } else {
            deleteItem(key, index)
        }
    }


    return (
        <div>
            <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
                Profile Information
            </h2>

            <form action="">
                <div className="mb-5">
                    <p className="form__label">Name*</p>
                    <input type="text" name="name" value={formData.name} placeholder='Full Name' onChange={handleInputChange} className="form__input" />
                </div>
                <div className="mb-5">
                    <p className="form__label">Email*</p>
                    <input type="text" name="email" value={formData.email} placeholder='Full Email' onChange={handleInputChange} className="form__input" disabled readOnly aria-readonly />
                </div>
                <div className="mb-5">
                    <p className="form__label">Phone*</p>
                    <input type="text" name="phone" value={formData.phone} placeholder='Phone Number' onChange={handleInputChange} className="form__input" />
                </div>
                <div className="mb-5">
                    <p className="form__label">Bio*</p>
                    <input type="text" name="bio" value={formData.bio} placeholder='Bio' onChange={handleInputChange} className="form__input"  maxLength={100}/>
                </div>
                <div className="mb-5">
                    <div className="grid grid-cols-3 gap-5 mb-[30px]">
                        <div>
                            <p className="form__label">Gender*</p>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="form__input py-3.5">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <p className="form__label">Specialization*</p>
                            <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="form__input py-3.5">
                                <option value="">Select</option>
                                <option value="surgeon">Surgeon</option>
                                <option value="neurologist">Neurologist</option>
                                <option value="dermatologist">Dermatologist</option>
                            </select>
                        </div>
                        <div>
                            <p className="form__label">Ticket Price*</p>
                            <input type="number" name="ticketPrice" value={formData.ticketPrice} placeholder='100' onChange={handleInputChange} className="form__input" />
                        </div>
                    </div>
                </div>

                <div className='mb-5'>
                    <p className="form__label">Qualification*</p>
                    {console.log(formData)}
                    {formData?.qualifications?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="form__label">Starting Date*</p>
                                        <input onChange={e => handleNewFormChange(e, index, 'qualifications')} type="date" name='startingDate' value={item.startingDate} className="form__input" />
                                    </div>
                                    <div>
                                        <p className="form__label">Ending Date*</p>
                                        <input onChange={e => handleNewFormChange(e, index, 'qualifications')} type="date" name='endingDate' value={item.endingDate} className="form__input" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5 mt-5">
                                    <div>
                                        <p className="form__label">Degree*</p>
                                        <input onChange={e => handleNewFormChange(e, index, 'qualifications')} type="text" name='degree' value={item.degree} className="form__input" />
                                    </div>
                                    <div>
                                        <p className="form__label">University*</p>
                                        <input onChange={e => handleNewFormChange(e, index, 'qualifications')} type="text" name='university' value={item.university} className="form__input" />
                                    </div>
                                </div>

                                <button onClick={e => deleteFormRow(e, index, 'qualifications')} className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'><AiOutlineDelete /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={e => addNewFormRow(e, 'qualifications')} className='bg-[#100] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add Qualification</button>
                </div>

                <div className='mb-5'>
                    <p className="form__label">Experiences*</p>
                    {formData?.experiences?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="form__label">Starting Date*</p>
                                        <input type="date" onChange={e => handleNewFormChange(e, index, 'experiences')} name='startingDate' value={item.startingDate} className="form__input" />
                                    </div>
                                    <div>
                                        <p className="form__label">Ending Date*</p>
                                        <input type="date" onChange={e => handleNewFormChange(e, index, 'experiences')} name='endingDate' value={item.endingDate} className="form__input" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5 mt-5">
                                    <div>
                                        <p className="form__label">Position*</p>
                                        <input onChange={e => handleNewFormChange(e, index, 'experiences')} name='position' value={item.position} className="form__input" />
                                    </div>
                                    <div>
                                        <p className="form__label">Hospital*</p>
                                        <input onChange={e => handleNewFormChange(e, index, 'experiences')} name='hospital' value={item.hospital} className="form__input" />
                                    </div>
                                </div>

                                <button onClick={e => deleteFormRow(e, index, 'experiences')}  className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'><AiOutlineDelete /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={e => addNewFormRow(e, 'experiences')}  className='bg-[#100] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add Experience</button>
                </div>

                <div className='mb-5'>
                    <p className="form__label">Time Slots*</p>
                    {formData?.timeSlots?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                                    <div>
                                        <p className="form__label">Day*</p>
                                        <select name="day" value={item.day} onChange={e => handleNewFormChange(e, index, 'timeSlots')} className="form__input py-3.5">
                                            <option value="">Select</option>
                                            <option value="saturday">Saturday</option>
                                            <option value="sunday">Sunday</option>
                                            <option value="monday">Monday</option>
                                            <option value="tuesday">Tuesday</option>
                                            <option value="wednesday">Wednesday</option>
                                            <option value="thursday">Thursday</option>
                                            <option value="friday">Friday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="form__label">Starting Time*</p>
                                        <input type="time" onChange={e => handleNewFormChange(e, index, 'timeSlots')} name='startingTime' value={item.startingTime} className="form__input" />
                                    </div>
                                    <div>
                                        <p className="form__label">Ending Date*</p>
                                        <input type="time" onChange={e => handleNewFormChange(e, index, 'timeSlots')} name='endingTime' value={item.endingTime} className="form__input" />
                                    </div>
                                    <div className="flex items-center">
                                        <button onClick={e => deleteFormRow(e, index, 'timeSlots')}  className='bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer mt-6'><AiOutlineDelete /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={e => addNewFormRow(e, 'timeSlots')} className='bg-[#100] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add TimeSlot</button>
                </div>
                <div className="mb-5">
                    <p className="form__label">About*</p>
                    <textarea name="about" rows={5} value={formData.about} placeholder='Write about you' onChange={handleInputChange} className='form__input'></textarea>
                </div>

                <div className="mb-5 flex items-center gap-3">
                    {formData.photo && <figure className="w-[60px] h-[60px] rounded-xl border-2 border-solid border-primaryColor flex items-center justify-center">
                        <img src={formData.photo} alt="" className='w-full rounded-xl' />
                    </figure>}
                    <div className="relative w-[130px] h-[50px]">
                        <input
                            type="file"
                            name='photo'
                            id='customFile'
                            accept='.jpg, .png'
                            onChange={handleFileInputChange}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        
                        <label htmlFor="customFile" className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'>Upload Photo</label>
                    </div>
                </div>

                <div className="mt-7">
                    <button type='submit' onClick={updateProfileHandler} className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg cursor-pointer">{loading ? <PulseLoader size={12} color="#ffffff" /> : 'Update Profile'}</button>
                </div>
            </form>
        </div>
    )
}

export default DoctorProfile;
