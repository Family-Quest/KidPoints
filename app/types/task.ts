// types/user.ts
import type { Enums, Tables, TablesInsert, TablesUpdate } from '~/types/database'
import { z } from 'zod'
import type { Child } from './child'

export type TaskStatus = Enums<'task_status'>
export const TaskStatusEnum = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
} as const

export const taskStatusValues = [
  TaskStatusEnum.TODO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.DONE,
] as const

export type Task = Tables<'tasks'>
export type TaskInsert = TablesInsert<'tasks'>
export type TaskUpdate = TablesUpdate<'tasks'>

export type TaskAssignment = Tables<'task_assignments'> & {
  child?: Child | null
}

export type ActiveTask = Task & {
  assignment: TaskAssignment | null
}

export const taskUpdateSchema = z.object({
  title: z.string().min(1, 'validation.task_title_required').max(100, 'validation.task_title_max_length').optional(),
  description: z.string().max(500, 'validation.task_description_max_length').optional(),
  points: z.preprocess(
    val => val === '' ? undefined : Number(val),
    z.number({
      required_error: 'validation.task_points_min',
      invalid_type_error: 'validation.task_points_min',
    })
      .min(1, 'validation.task_points_min')
      .refine(val => !isNaN(val), {
        message: 'validation.task_points_min',
      }),
  ),
  status: z.enum(taskStatusValues).optional(),
  user_id: z.string().uuid().optional(),
})

const randomTasks = [
  { title: 'Ranger la chambre', description: 'Plie les vêtements et range les jouets.' },
  { title: 'Faire son lit', description: 'Oreiller bien placé, couverture tirée.' },
  { title: 'Mettre la table', description: 'Dispose les assiettes et les couverts pour tous.' },
  { title: 'Débarrasser la table', description: 'Ramène les assiettes et les verres à la cuisine.' },
  { title: 'Sortir la poubelle', description: 'Vérifie le tri et ferme bien le sac.' },
  { title: 'Donner à manger au chat', description: 'N\'oublie pas de vérifier l\'eau aussi.' },
  { title: 'Remplir la gamelle du chien', description: 'De l\'eau fraîche et des croquettes.' },
  { title: 'Lire un livre', description: 'Lis au moins 15 minutes d\'un livre de ton choix.' },
  { title: 'Éteindre les lumières inutiles', description: 'Un bon geste pour la planète.' },
  { title: 'Aider à plier le linge', description: 'Classe les chaussettes ensemble !' },
  { title: 'Préparer son cartable', description: 'Vérifie les devoirs et range les affaires.' },
  { title: 'Trier les jouets', description: 'Donne ce que tu n\'utilises plus.' },
  { title: 'Arroser les plantes', description: 'N\'oublie pas celles du balcon.' },
  { title: 'Nettoyer la table', description: 'Utilise une éponge propre.' },
  { title: 'Faire ses devoirs', description: 'Concentre-toi et demande de l\'aide si besoin.' },
  { title: 'Aider à cuisiner', description: 'Lave les légumes ou remue la sauce.' },
  { title: 'Nettoyer ses chaussures', description: 'Un coup de brosse et elles brillent.' },
  { title: 'Faire un compliment', description: 'Dis quelque chose de gentil à quelqu\'un.' },
  { title: 'Écrire un mot gentil', description: 'Laisse un petit mot doux à la maison.' },
  { title: 'Dire merci 3 fois', description: 'La politesse, c\'est important.' },
  { title: 'Passer un coup de balai', description: 'Choisis une pièce à nettoyer.' },
  { title: 'Laver la vaisselle', description: 'Rince bien et fais attention à la casse.' },
  { title: 'Faire une activité manuelle', description: 'Coloriage, bricolage ou pâte à modeler.' },
  { title: 'Écouter sans interrompre', description: 'Pendant une discussion ou un repas.' },
  { title: 'Aider un frère ou une sœur', description: 'Propose ton aide avec le sourire.' },
  { title: 'S\'habiller seul(e)', description: 'Choisis une tenue et habille-toi sans aide.' },
  { title: 'Se brosser les dents', description: 'Pendant 2 minutes, matin et soir.' },
  { title: 'Mettre son pyjama', description: 'Et prépare ta tenue du lendemain.' },
  { title: 'Préparer son goûter', description: 'Choisis une collation équilibrée.' },
  { title: 'Classer ses livres', description: 'Range-les bien dans la bibliothèque.' },
  { title: 'Ramasser les feuilles dehors', description: 'Un petit coup de râteau dans le jardin.' },
  { title: 'Aider à mettre une lessive', description: 'Avec un adulte, trie le linge.' },
  { title: 'Changer la serviette de toilette', description: 'Mets-en une propre dans la salle de bain.' },
  { title: 'Aider à porter les courses', description: 'Même un petit sac, c\'est utile.' },
  { title: 'Écouter une histoire audio', description: 'Ferme les yeux et imagine.' },
  { title: 'Créer un dessin pour un proche', description: 'Un petit cadeau plein d\'amour.' },
  { title: 'Remettre les coussins du canapé', description: 'Pour un salon tout beau.' },
  { title: 'Se coiffer', description: 'Brosse tes cheveux avant de sortir.' },
  { title: 'Nettoyer la table basse', description: 'Passe un chiffon doux dessus.' },
  { title: 'Remplir la carafe d\'eau', description: 'Et la mettre au frigo.' },
  { title: 'Dire bonjour aux voisins', description: 'Avec un grand sourire.' },
  { title: 'Remplir le bol de céréales', description: 'Sans renverser 😄.' },
  { title: 'Aller chercher le courrier', description: 'Et le poser bien en évidence.' },
  { title: 'Éteindre la télé à l\'heure', description: 'Sans qu\'on ait à le demander.' },
  { title: 'Écouter de la musique calme', description: 'Et se détendre un peu.' },
  { title: 'Créer un jeu de société', description: 'Invente tes règles !' },
  { title: 'Organiser un coin lecture', description: 'Avec un coussin et tes livres préférés.' },
  { title: 'Inventer une histoire', description: 'Et la raconter à quelqu\'un.' },
  { title: 'Apprendre un mot nouveau', description: 'Et l\'utiliser dans une phrase.' },
]

export function getRandomTask() {
  return randomTasks[Math.floor(Math.random() * randomTasks.length)]
}
