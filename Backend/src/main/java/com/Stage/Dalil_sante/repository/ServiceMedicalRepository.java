package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.ServiceMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceMedicalRepository
        extends JpaRepository<ServiceMedical, Long> {

    Optional<ServiceMedical> findByNom(String nom);

    boolean existsByNom(String nom);

    List<ServiceMedical> findByActifTrue();
}
