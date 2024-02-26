// import { doctors } from '../../assets/data/doctors'
import { BASE_URL } from '../../config'
import { useFetchData } from '../../hooks/useFetchData'
import Error from '../Error/Error'
import Loader from '../Loader/Loading'
import DoctorCard from './DoctorCard'

const DoctorList = () => {
    const { data, loading, error } = useFetchData(`${BASE_URL}/doctors`)
    return (
        <>
            {loading && <Loader />}
            {error && <Error />}
            
            {!loading && !error && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
                {data.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
            </div>}
        </>
    )
}

export default DoctorList