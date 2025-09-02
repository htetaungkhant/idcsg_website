import TeamList from "./(components)/TeamList";

const getData = async () => {
  return [
    {
      id: "doctor1",
      name: "Dr.  Lien Li Choo",
      degree: "B.D.A (Orthodontist)",
      about:
        "Dr. Lien Li Choo is an experienced Orthodontist with a strong foundation in dental and orthodontic care. He specializes in the diagnosis and treatment of misaligned teeth and jaw irregularities in both children and adults. Dr. Choo is committed to providing precise, personalized care using modern techniques such as metal braces and clear aligners. With a focus on function, aesthetics, and long-term stability, he helps patients achieve confident, healthy smiles through expert orthodontic planning.",
      image: {
        id: "doctor1",
        image: "/dummy-data/doctor.png",
        thumbnail: "/dummy-data/doctor.png",
      },
    },
    {
      id: "doctor2",
      name: "Dr.  Lien Li Choo",
      degree: "B.D.A (Orthodontist)",
      about:
        "Dr. Lien Li Choo is an experienced Orthodontist with a strong foundation in dental and orthodontic care. He specializes in the diagnosis and treatment of misaligned teeth and jaw irregularities in both children and adults. Dr. Choo is committed to providing precise, personalized care using modern techniques such as metal braces and clear aligners. With a focus on function, aesthetics, and long-term stability, he helps patients achieve confident, healthy smiles through expert orthodontic planning.",
      image: {
        id: "doctor1",
        image: "/dummy-data/doctor.png",
        thumbnail: "/dummy-data/doctor.png",
      },
    },
    {
      id: "doctor3",
      name: "Dr.  Lien Li Choo",
      degree: "B.D.A (Orthodontist)",
      about:
        "Dr. Lien Li Choo is an experienced Orthodontist with a strong foundation in dental and orthodontic care. He specializes in the diagnosis and treatment of misaligned teeth and jaw irregularities in both children and adults. Dr. Choo is committed to providing precise, personalized care using modern techniques such as metal braces and clear aligners. With a focus on function, aesthetics, and long-term stability, he helps patients achieve confident, healthy smiles through expert orthodontic planning.",
      image: {
        id: "doctor1",
        image: "/dummy-data/doctor.png",
        thumbnail: "/dummy-data/doctor.png",
      },
    },
    {
      id: "doctor4",
      name: "Dr.  Lien Li Choo",
      degree: "B.D.A (Orthodontist)",
      about:
        "Dr. Lien Li Choo is an experienced Orthodontist with a strong foundation in dental and orthodontic care. He specializes in the diagnosis and treatment of misaligned teeth and jaw irregularities in both children and adults. Dr. Choo is committed to providing precise, personalized care using modern techniques such as metal braces and clear aligners. With a focus on function, aesthetics, and long-term stability, he helps patients achieve confident, healthy smiles through expert orthodontic planning.",
      image: {
        id: "doctor1",
        image: "/dummy-data/doctor.png",
        thumbnail: "/dummy-data/doctor.png",
      },
    },
    {
      id: "doctor5",
      name: "Dr.  Lien Li Choo",
      degree: "B.D.A (Orthodontist)",
      about:
        "Dr. Lien Li Choo is an experienced Orthodontist with a strong foundation in dental and orthodontic care. He specializes in the diagnosis and treatment of misaligned teeth and jaw irregularities in both children and adults. Dr. Choo is committed to providing precise, personalized care using modern techniques such as metal braces and clear aligners. With a focus on function, aesthetics, and long-term stability, he helps patients achieve confident, healthy smiles through expert orthodontic planning.",
      image: {
        id: "doctor1",
        image: "/dummy-data/doctor.png",
        thumbnail: "/dummy-data/doctor.png",
      },
    },
    {
      id: "doctor6",
      name: "Dr.  Lien Li Choo",
      degree: "B.D.A (Orthodontist)",
      about:
        "Dr. Lien Li Choo is an experienced Orthodontist with a strong foundation in dental and orthodontic care. He specializes in the diagnosis and treatment of misaligned teeth and jaw irregularities in both children and adults. Dr. Choo is committed to providing precise, personalized care using modern techniques such as metal braces and clear aligners. With a focus on function, aesthetics, and long-term stability, he helps patients achieve confident, healthy smiles through expert orthodontic planning.",
      image: {
        id: "doctor1",
        image: "/dummy-data/doctor.png",
        thumbnail: "/dummy-data/doctor.png",
      },
    },
  ];
};

export default async function Teams() {
  const doctors = await getData();

  return (
    <>
      <TeamList doctors={doctors} />
    </>
  );
}
