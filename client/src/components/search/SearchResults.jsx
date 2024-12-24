import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Button,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { FaBookmark, FaRegBookmark, FaMapMarkerAlt, FaBriefcase, FaDollarSign } from 'react-icons/fa';
import useJobStore from '../../store/useJobStore';

const SearchResults = ({ results, type = 'jobs', loading, onItemClick }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const savedJobs = useJobStore(state => state.savedJobs);
  const toggleSaveJob = useJobStore(state => state.toggleSaveJob);

  const renderJobItem = (job) => {
    const isSaved = savedJobs.includes(job.id);

    return (
      <Box
        key={job.id}
        p={4}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="sm"
        _hover={{ shadow: 'md', cursor: 'pointer' }}
        onClick={() => onItemClick(job)}
      >
        <HStack justify="space-between" align="start">
          <HStack spacing={4}>
            <Avatar
              size="md"
              name={job.company}
              src={job.company_logo}
            />
            <Box>
              <Text fontWeight="bold" fontSize="lg">{job.title}</Text>
              <Text color="gray.600">{job.company}</Text>
              <HStack spacing={4} mt={2}>
                <HStack>
                  <FaMapMarkerAlt />
                  <Text fontSize="sm">{job.location}</Text>
                </HStack>
                <HStack>
                  <FaBriefcase />
                  <Text fontSize="sm">{job.type}</Text>
                </HStack>
                <HStack>
                  <FaDollarSign />
                  <Text fontSize="sm">
                    ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                  </Text>
                </HStack>
              </HStack>
              <HStack mt={2} spacing={2}>
                {job.required_skills?.map((skill) => (
                  <Badge key={skill} colorScheme="blue">
                    {skill}
                  </Badge>
                ))}
              </HStack>
              {job.match_score && (
                <Badge mt={2} colorScheme="green">
                  {job.match_score}% Match
                </Badge>
              )}
            </Box>
          </HStack>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </Button>
        </HStack>
      </Box>
    );
  };

  const renderProfileItem = (profile) => (
    <Box
      key={profile.id}
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md', cursor: 'pointer' }}
      onClick={() => onItemClick(profile)}
    >
      <HStack spacing={4}>
        <Avatar
          size="lg"
          name={profile.full_name}
          src={profile.avatar_url}
        />
        <Box>
          <Text fontWeight="bold" fontSize="lg">{profile.full_name}</Text>
          <Text color="gray.600">{profile.title}</Text>
          <Text fontSize="sm" mt={2}>{profile.bio}</Text>
          <HStack mt={2} spacing={2}>
            {profile.skills?.map((skill) => (
              <Badge key={skill} colorScheme="purple">
                {skill}
              </Badge>
            ))}
          </HStack>
        </Box>
      </HStack>
    </Box>
  );

  const renderTeamItem = (team) => (
    <Box
      key={team.id}
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md', cursor: 'pointer' }}
      onClick={() => onItemClick(team)}
    >
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Avatar
            size="md"
            name={team.name}
            src={team.avatar_url}
          />
          <Box>
            <Text fontWeight="bold" fontSize="lg">{team.name}</Text>
            <Text color="gray.600">{team.description}</Text>
            <HStack mt={2}>
              <Badge colorScheme="green">{team.members?.length} Members</Badge>
              {team.match_score && (
                <Badge colorScheme="blue">
                  {team.match_score}% Match
                </Badge>
              )}
            </HStack>
            <HStack mt={2} spacing={2}>
              {team.required_skills?.map((skill) => (
                <Badge key={skill} colorScheme="orange">
                  {skill}
                </Badge>
              ))}
            </HStack>
          </Box>
        </HStack>
      </HStack>
    </Box>
  );

  if (loading) {
    return (
      <VStack spacing={4}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="200px" width="100%" borderRadius="lg" />
        ))}
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {results.map((item) => {
        switch (type) {
          case 'jobs':
            return renderJobItem(item);
          case 'profiles':
            return renderProfileItem(item);
          case 'teams':
            return renderTeamItem(item);
          default:
            return null;
        }
      })}
    </VStack>
  );
};

export default SearchResults;
