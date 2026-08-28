import { Alert, Card, Empty, List, Spin, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components'
import { useOrientationBrowse } from '@/hooks/useOrientationBrowse'
import styles from './UserAskQuestion.module.scss'

const { Text } = Typography

/**
 * Poser une question (espace UTILISATEUR).
 * -------------------------------------------
 * Le Backend expose uniquement du CRUD sur les Questions/Options/Rules/Results
 * d'orientation (OrientationQuestionController, OrientationOptionController...),
 * mais aucun endpoint pour soumettre des réponses et recevoir un résultat calculé
 * (aucune logique d'évaluation n'existe côté serveur - vérifié en profondeur :
 * la seule requête qui y ressemblait, OrientationRuleRepository
 * .findByOptionIdAndActiveTrueOrderByPriorityDesc, n'est appelée nulle part).
 * Cette page affiche donc les questions/options actives réelles en lecture
 * seule, avec un message honnête plutôt qu'un faux formulaire de soumission.
 */
function UserAskQuestion() {
  const { questionsWithOptions, isLoading, isError, refetchAll } = useOrientationBrowse()

  return (
    <div>
      <PageHeader
        title="Poser une question"
        subtitle="Questionnaire d'orientation médicale."
      />

      <Alert
        type="info"
        showIcon
        message="Fonctionnalité en cours de construction"
        description="L'envoi de vos réponses et l'obtention d'un résultat d'orientation ne sont pas encore disponibles. Vous pouvez pour l'instant consulter les questions ci-dessous."
        style={{ marginBottom: 16 }}
      />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Erreur de chargement"
          description="Impossible de récupérer les questions depuis le serveur."
          action={
            <a onClick={refetchAll} role="button">
              Réessayer
            </a>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading && (
        <div className={styles.centerState}>
          <Spin size="large" tip="Chargement..." />
        </div>
      )}

      {!isLoading && !isError && questionsWithOptions.length === 0 && (
        <Empty description="Aucune question disponible pour le moment." />
      )}

      {!isLoading &&
        !isError &&
        questionsWithOptions.map((question) => (
          <Card
            key={question.id}
            className={styles.questionCard}
            title={
              <span>
                <QuestionCircleOutlined /> {question.questionText}
              </span>
            }
          >
            {question.options.length === 0 ? (
              <Text type="secondary">Aucune option disponible pour cette question.</Text>
            ) : (
              <List
                dataSource={question.options}
                renderItem={(option) => (
                  <List.Item className={styles.optionItem}>{option.optionText}</List.Item>
                )}
              />
            )}
          </Card>
        ))}
    </div>
  )
}

export default UserAskQuestion