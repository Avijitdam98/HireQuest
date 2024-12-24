import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign } from 'react-icons/fa';

const RecommendationCard = ({ item, onClick }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const renderJobRecommendation = (job) => (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md', cursor: 'pointer' }}
      onClick={() => onClick(job)}
    >
      <HStack spacing={3}>
        <Avatar size="md" name={job.company} src={job.company_logo} />
        <Box flex="1">
          <Text fontWeight="bold" noOfLines={1}>{job.title}</Text>
          <Text fontSize="sm" color="gray.600" noOfLines={1}>{job.company}</Text>
          
          <HStack mt={2} spacing={4}>
            <HStack fontSize="xs">
              <FaMapMarkerAlt />
              <Text>{job.location}</Text>
            </HStack>
            <HStack fontSize="xs">
              <FaBriefcase />
              <Text>{job.type}</Text>
            </HStack>
          </HStack>

          <Box mt={2}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Match Score</Text>
              <Text fontSize="sm" fontWeight="bold" color="green.500">
                {job.match_score}%
              </Text>
            </HStack>
            <Progress
              value={job.match_score}
              size="sm"
              colorScheme="green"
              borderRadius="full"
            />
          </Box>

          {job.missing_skills && job.missing_skills.length > 0 && (
            <Box mt={2}>
              <Text fontSize="xs" fontWeight="medium" mb={1}>Missing Skills:</Text>
              <HStack spacing={1}>
                {job.missing_skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} size="sm" colorScheme="red">
                    {skill}
                  </Badge>
                ))}
                {job.missing_skills.length > 3 && (
                  <Badge size="sm" variant="outline">
                    +{job.missing_skills.length - 3}
                  </Badge>
                )}
              </HStack>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );

  const renderTeamRecommendation = (team) => (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md', cursor: 'pointer' }}
      onClick={() => onClick(team)}
    >
      <HStack spacing={3}>
        <Avatar size="md" name={team.name} src={team.avatar_url} />
        <Box flex="1">
          <Text fontWeight="bold" noOfLines={1}>{team.name}</Text>
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {team.description}
          </Text>

          <Box mt={2}>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Team Fit</Text>
              <Text fontSize="sm" fontWeight="bold" color="blue.500">
                {team.match_score}%
              </Text>
            </HStack>
            <Progress
              value={team.match_score}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
            />
          </Box>

          {team.complementary_skills && team.complementary_skills.length > 0 && (
            <Box mt={2}>
              <Text fontSize="xs" fontWeight="medium" mb={1}>Your Complementary Skills:</Text>
              <HStack spacing={1}>
                {team.complementary_skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} size="sm" colorScheme="green">
                    {skill}
                  </Badge>
                ))}
                {team.complementary_skills.length > 3 && (
                  <Badge size="sm" variant="outline">
                    +{team.complementary_skills.length - 3}
                  </Badge>
                )}
              </HStack>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );

  const renderProfileRecommendation = (profile) => (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md', cursor: 'pointer' }}
      onClick={() => onClick(profile)}
    >
      <HStack spacing={3}>
        <Avatar size="md" name={profile.full_name} src={profile.avatar_url} />
        <Box flex="1">
          <Text fontWeight="bold" noOfLines={1}>{profile.full_name}</Text>
          <Text fontSize="sm" color="gray.600" noOfLines={1}>{profile.title}</Text>

          {profile.skills && profile.skills.length > 0 && (
            <Box mt={2}>
              <Text fontSize="xs" fontWeight="medium" mb={1}>Top Skills:</Text>
              <HStack spacing={1}>
                {profile.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} size="sm" colorScheme="purple">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 3 && (
                  <Badge size="sm" variant="outline">
                    +{profile.skills.length - 3}
                  </Badge>
                )}
              </HStack>
            </Box>
          )}

          {profile.match_reasons && profile.match_reasons.length > 0 && (
            <Box mt={2}>
              <Text fontSize="xs" color="gray.600" noOfLines={1}>
                {profile.match_reasons[0]}
              </Text>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );

  switch (item.type) {
    case 'job':
      return renderJobRecommendation(item);
    case 'team':
      return renderTeamRecommendation(item);
    case 'profile':
      return renderProfileRecommendation(item);
    default:
      return null;
  }
};

export default RecommendationCard;
