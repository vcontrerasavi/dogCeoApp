import React, { useState, useEffect } from 'react';
import { GridItem } from './components/GridItem';
import { MultiSelect } from './components/MultiSelect';
const DogCeoApp = () => {

    const url = 'https://dog.ceo/api'
    
    const [breedsOptions, setBreedsOptions] = useState([]);
    const [subBreedsOptions, setSubBreedsOptions] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [subBreeds, setSubBreeds] = useState([]);

    //ENDPOINTS
    const getBreedsEndpoint = async() =>{
        const response = await fetch(`${url}/breeds/list/all`);
        const data = await response.json();
        localStorage.setItem('breeds', JSON.stringify(data.message));
        return Object.keys(data.message);
    }
    const getSubBreedEndpoint = async(breed) =>{
        const response = await fetch(`${url}/breed/${breed}/list`);
        const data = await response.json()
        return data.message;
    }
    const getBreedInfoEndpoint = async(breed) =>{
        const response = await fetch(`${url}/breed/${breed}/images/random/6`);
        const data = await response.json();
        return data.message;
    }
    const getSubBreedInfoEndpoint = async(breed,subBreed) =>{
        const response = await fetch(`${url}/breed/${breed}/${subBreed}/images/random/6`);
        const data = await response.json();
        return data.message;
    }
    
    //Trae las opciones para elegir razas
    const getBreedsOptions = async() => {
        const message = await getBreedsEndpoint();
        const breedsData = 
            message.map( breed => {
                return { value: breed, label:breed } 
            })
        setBreedsOptions(breedsData);
    }
    //Trae las opciones para elegir sub-razas
    const getSubBreedsOptions = async(breed) => {
        const message = await getSubBreedEndpoint(breed.value);
        const subBreedsData =
            message.map( subBreed => {
            return { value: subBreed, label:subBreed, breed:breed.value } 
            })
        setSubBreedsOptions(sbrd => [...subBreedsData, ...sbrd]);
        return subBreedsData;
    }
    //trae las fotos de acuerdo a las raza seleccionada
    const getBreedInfo = (breedsSelected) => {
        setBreeds([])
        setSubBreedsOptions([])
        breedsSelected.forEach(async(breedSelected) => {
            const subBreeds = await getSubBreedsOptions(breedSelected);
            if(subBreeds.length === 0 || subBreeds === undefined){
                const imageBreedMessage = await getBreedInfoEndpoint(breedSelected.value);
                setBreeds(brd =>[{breedName: breedSelected.value, imgs: imageBreedMessage}, ...brd]);
            }
        });
    }
    //trae las fotos de acuerdo a las subrazas seleccionadas
    const getSubBreedInfo = (subBreedsSelected) => {
        setSubBreeds([]);
        subBreedsSelected.forEach(async(subBreedSelected) => {
            const imageSubBreedMessage = await getSubBreedInfoEndpoint(subBreedSelected.breed, subBreedSelected.value);
            setSubBreeds(sbrd =>[{breedName: subBreedSelected.breed, subBreedName: subBreedSelected.value, imgs: imageSubBreedMessage}, ...sbrd]);
        });
    }
    //Encargado de solicitar las razas al comienzo
    useEffect(()=>{
        getBreedsOptions();
    }, []);
    return (
        <>  
            <div className='container'>
                <div className="row">
                    <div>
                        <h2 className="search-dog">Busca tu Dogo favorito!</h2>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <MultiSelect 
                                    placeholder="Seleccione una raza..." 
                                    nameSelect="breed" 
                                    options={breedsOptions}
                                    onChange={ getBreedInfo}
                                />
                            </div>
                            <div className="col-6">
                                <MultiSelect 
                                    placeholder="Seleccione la sub raza..." 
                                    nameSelect="sub-breed"
                                    options={subBreedsOptions}
                                    onChange={getSubBreedInfo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div>
                    { 
                        breeds.map( breed => (
                            <div key={breed.breedName}>
                                <h2 className='title-breed' key={breed.breedName}>{breed.breedName}</h2>
                                <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                                    {
                                        breed.imgs.map(img =>(
                                            <GridItem
                                                key={img}
                                                img={img}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                    {
                       subBreeds.map( subBreed => (
                        <div key={subBreed.breedName}>
                            <h2 className='title-breed' key={subBreed.breedName}>{subBreed.breedName}: <span>{subBreed.subBreedName}</span></h2> 
                            <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                                {
                                    subBreed.imgs.map(img =>(
                                        <GridItem
                                            key={img}
                                            img={img}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )) 
                    }
                </div>    
            </div>
        </>
    )
}
export default DogCeoApp;