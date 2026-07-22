package com.Stage.Dalil_sante.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Stage.Dalil_sante.entity.NumeroUrgence;

@Repository
public interface NumeroUrgenceRepository extends JpaRepository<NumeroUrgence, Long> {

}
